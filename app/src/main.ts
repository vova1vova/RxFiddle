import AnalyticsObserver from "./analytics"
import JsonCollector from "./collector/jsonCollector"
import LocalStorageCollector, { LocalStorageSender } from "./collector/localStorageCollector"
import PostMessageCollector from "./collector/postMessageCollector"
import RxRunner from "./collector/runner"
import patch from "./patch"
import "./prelude"
import CodeEditor from "./ui/codeEditor"
import { hbox, vbox, vboxo } from "./ui/flex"
import Resizer from "./ui/resizer"
import { LanguageMenu, Query, errorHandler, shareButton } from "./ui/shared"
import Splash from "./ui/splash"
import { UUID, atou, utoa } from "./utils"
import Visualizer, { DataSource } from "./visualization"
import Grapher from "./visualization/grapher"
import * as Rx from "rxjs"
import h from "snabbdom/h"
import { VNode } from "snabbdom/vnode"

// Inception
import Logger, { Message } from "./collector/logger"
import { TreeCollector } from "./instrumentation/rxjs-5.x.x/collector"
import Instrumentation from "./instrumentation/rxjs-5.x.x/instrumentation"

// Inception
if (Query.get("instrument")) {
  let sender = new LocalStorageSender(UUID())
  let instrumentation = new Instrumentation(new TreeCollector(new Logger(m => sender.send(m)), Rx), Rx)
  instrumentation.setup()
}

const DataSource$: Rx.Observable<{
  data: DataSource,
  vnode?: Rx.Observable<VNode>,
  runner?: RxRunner,
  editor?: CodeEditor,
  q: any
}> = Query.$all.scan((prev, q) => {
  if (q.type === "postMessage") {
    let collector = prev.type === "postMessage" ?
      prev.collector :
      new PostMessageCollector()
    return { data: collector, q }
  } else if (q.type === "message") {
    let collector = prev.type === "message" && prev.q.session === q.session ?
      prev.collector :
      new LocalStorageCollector(q.session)
    // doRender = false
    return { data: collector, q }
  } else if (q.type === "demo" && q.source) {
    let collector = prev.type === "demo" ? prev.collector : new JsonCollector()
    if (!prev.q || q.source !== prev.q.source) { collector.restart(q.source) }
    return { data: collector, q }
  } else if (q.type === "ws" && q.url) {
    let collector = prev.type === "ws" ? prev.collector : new JsonCollector()
    if (!prev.q || q.url !== prev.q.url) { collector.restart(q.url) }
    return { data: collector, q }
  } else if (q.type === "editor") {
    if (q.type === prev.q.type && q.lib === prev.q.lib) {
      let editor = prev.editor
      let runner = prev.runner
      return {
        data: runner,
        runner,
        editor,
        vnode: editor.dom,
        q,
      }
    } else {
      let config = LanguageMenu.get(q.lib).runnerConfig
      let editor = new CodeEditor(q.code ? atou(decodeURI(q.code)) : undefined)
      let code = Rx.Observable.fromEventPattern<string>(h => editor.withValue(h as any), h => void (0))
      let runner = new RxRunner(config, code, AnalyticsObserver)
      return {
        data: runner,
        runner,
        editor,
        vnode: editor.dom,
        q,
      }
    }
  } else {
    return { q }
  }
}, { q: {} }).distinctUntilKeyChanged("data")

Query.$.map(query => ({ query, type: "query" })).subscribe(AnalyticsObserver)

function menu(language: VNode, runner?: RxRunner, editor?: CodeEditor): VNode {
  let clickHandler = () => {
    editor.withValue(v => {
      Query.update({ code: utoa(v) })
      runner.trigger()
    })
  }
  return h("div.left.ml3.flex", { attrs: { id: "menu" } }, [
    language,
    ...(runner ? [
      h(`button.btn${runner.currentState === "initializing" ? ".disabled" : ""}`, {
        attrs: { disabled: runner.currentState === "initializing" ? true : false },
        on: { click: clickHandler },
      }, runner.action),
    ] : []),
    ...(editor ? [shareButton(editor)] : []),
  ])
}

const LanguageMenu$ = new LanguageMenu().stream()

const VNodes$: Rx.Observable<VNode[]> = DataSource$.switchMap(collector => {
  // Attach language menu
  LanguageMenu$.language.subscribe(lang => collector && collector.editor && collector.editor.withValue(v => {
    Query.update({ lib: lang.id })
  }))

  if (collector && collector.data) {
    return Rx.Observable.of(0)
      .flatMap(_ => {
        let data = new (class DataSourceWrapper implements DataSource {
          stream = collector.data.dataObs
          .do(
            x => console.log('dataObs Do Next:', x),
            err => console.log('dataObs Do Error:', err),
            () => console.log('dataObs Do Completed')
          )

          consoleOutput = collector.data.dataObs
          .filter(x => (x as any) == "reset")
          .switchMap(function(x) {
            return collector.data.dataObs
            .filter(x => (x as any) != "reset")
            .scan(function(acc: String, v) {
              let result = acc
              if (acc.length != 0) {
                result = result + ","
              }
              result = result + JSON.stringify(v)
              return result
            }, "")
            .debounce(() => Rx.Observable.interval(1000))
            .do(x => console.log(x))
            .ignoreElements()
            .map(function(x) {
              return {id: 1, type: "node", node: {}} as Message
            })
            }
          )
          dataObs = this.stream.merge(this.consoleOutput)
          })

        let vis = new Visualizer(new Grapher(data))
        return vis.stream(AnalyticsObserver)
      })
      .catch(errorHandler)
      .retry()
      .startWith({ dom: h("span.rxfiddle-waiting", "Waiting for Rx activity..."), timeSlider: h("div") })
      .combineLatest(
      collector.vnode || Rx.Observable.of(undefined),
      LanguageMenu$.dom,
      collector.runner && collector.runner.state || Rx.Observable.of(undefined),
      (render, input, langs, state) => [
        h("div#menufold-static.menufold", [
          h("a.brand.left", { attrs: { href: "#" } }, [
            h("img", { attrs: { alt: "ReactiveX", src: "images/RxIconXs.png" } }),
            "RxFiddle" as any as VNode,
          ]),
          menu(langs, collector.runner, collector.editor),
        ]),
        // h("div#menufold-fixed.menufold"),
        hbox(...(input ?
          [Resizer.h(
            "rxfiddle/editor+rxfiddle/inspector",
            input as any,
            vboxo({ class: "viewer-panel" }, /*render.timeSlider,*/ render.dom)
          )] :
          [vbox(/*render.timeSlider,*/ render.dom)]
        )),
      ])
  } else {
    return new Splash().stream().map(n => [n])
  }
})

let app = document.querySelector("body") as VNode | HTMLBodyElement
VNodes$.subscribe(vnodes => {
  try {
    app = patch(app, h("body#", { tabIndexRoot: true }, vnodes))
  } catch (e) {
    console.error("Error in snabbdom patching; restoring. Next patch will be handled clean.", e)
    app = document.querySelector("body")
  }
})
