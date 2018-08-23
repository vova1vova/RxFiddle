/*
 * RxFiddle - Rx debugger
 * Copyright (C) 2016 Herman Banken
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package nl.hermanbanken.rxfiddle;

import nl.hermanbanken.rxfiddle.data.Follow;
import nl.hermanbanken.rxfiddle.data.Invoke;
import nl.hermanbanken.rxfiddle.data.InvokeResult;
import nl.hermanbanken.rxfiddle.data.RxFiddleEvent;
import nl.hermanbanken.rxfiddle.js.collector.TreePoster;
import nl.hermanbanken.rxfiddle.visualiser.StdOutVisualizer;

import java.util.LinkedList;

public class CaptureLogger extends TreePoster {
    LinkedList<Captured> events = new LinkedList<>();

    public void reset() {
        events.clear();
    }

    @Override
    public void addNode(long id, String type) {
        events.add(new AddNode(id, type));
        super.addNode(id, type);
    }

    @Override
    public void addMeta(long id, Object meta) {
        events.add(new AddMeta(id, meta));
        super.addMeta(id, meta);
    }

    @Override
    public void addEdge(String v, String w, String type, Object meta) {
        events.add(new AddEdge(v, w, type, meta));
        super.addEdge(v, w, type, meta);
    }
}