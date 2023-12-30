
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value, mounting) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        if (!mounting || value !== undefined) {
            select.selectedIndex = -1; // no option should be selected
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked');
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @fileoverview Firebase constants.  Some of these (@defines) can be overridden at compile-time.
     */
    const CONSTANTS = {
        /**
         * @define {boolean} Whether this is the client Node.js SDK.
         */
        NODE_CLIENT: false,
        /**
         * @define {boolean} Whether this is the Admin Node.js SDK.
         */
        NODE_ADMIN: false,
        /**
         * Firebase SDK Version
         */
        SDK_VERSION: '${JSCORE_VERSION}'
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Throws an error if the provided assertion is falsy
     */
    const assert = function (assertion, message) {
        if (!assertion) {
            throw assertionError(message);
        }
    };
    /**
     * Returns an Error object suitable for throwing.
     */
    const assertionError = function (message) {
        return new Error('Firebase Database (' +
            CONSTANTS.SDK_VERSION +
            ') INTERNAL ASSERT FAILED: ' +
            message);
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const stringToByteArray$1 = function (str) {
        // TODO(user): Use native implementations if/when available
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c < 128) {
                out[p++] = c;
            }
            else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            }
            else if ((c & 0xfc00) === 0xd800 &&
                i + 1 < str.length &&
                (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
                // Surrogate Pair
                c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
            else {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return out;
    };
    /**
     * Turns an array of numbers into the string given by the concatenation of the
     * characters to which the numbers correspond.
     * @param bytes Array of numbers representing characters.
     * @return Stringification of the array.
     */
    const byteArrayToString = function (bytes) {
        // TODO(user): Use native implementations if/when available
        const out = [];
        let pos = 0, c = 0;
        while (pos < bytes.length) {
            const c1 = bytes[pos++];
            if (c1 < 128) {
                out[c++] = String.fromCharCode(c1);
            }
            else if (c1 > 191 && c1 < 224) {
                const c2 = bytes[pos++];
                out[c++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            }
            else if (c1 > 239 && c1 < 365) {
                // Surrogate Pair
                const c2 = bytes[pos++];
                const c3 = bytes[pos++];
                const c4 = bytes[pos++];
                const u = (((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) -
                    0x10000;
                out[c++] = String.fromCharCode(0xd800 + (u >> 10));
                out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
            }
            else {
                const c2 = bytes[pos++];
                const c3 = bytes[pos++];
                out[c++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            }
        }
        return out.join('');
    };
    // We define it as an object literal instead of a class because a class compiled down to es5 can't
    // be treeshaked. https://github.com/rollup/rollup/issues/1691
    // Static lookup maps, lazily populated by init_()
    const base64 = {
        /**
         * Maps bytes to characters.
         */
        byteToCharMap_: null,
        /**
         * Maps characters to bytes.
         */
        charToByteMap_: null,
        /**
         * Maps bytes to websafe characters.
         * @private
         */
        byteToCharMapWebSafe_: null,
        /**
         * Maps websafe characters to bytes.
         * @private
         */
        charToByteMapWebSafe_: null,
        /**
         * Our default alphabet, shared between
         * ENCODED_VALS and ENCODED_VALS_WEBSAFE
         */
        ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',
        /**
         * Our default alphabet. Value 64 (=) is special; it means "nothing."
         */
        get ENCODED_VALS() {
            return this.ENCODED_VALS_BASE + '+/=';
        },
        /**
         * Our websafe alphabet.
         */
        get ENCODED_VALS_WEBSAFE() {
            return this.ENCODED_VALS_BASE + '-_.';
        },
        /**
         * Whether this browser supports the atob and btoa functions. This extension
         * started at Mozilla but is now implemented by many browsers. We use the
         * ASSUME_* variables to avoid pulling in the full useragent detection library
         * but still allowing the standard per-browser compilations.
         *
         */
        HAS_NATIVE_SUPPORT: typeof atob === 'function',
        /**
         * Base64-encode an array of bytes.
         *
         * @param input An array of bytes (numbers with
         *     value in [0, 255]) to encode.
         * @param webSafe Boolean indicating we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeByteArray(input, webSafe) {
            if (!Array.isArray(input)) {
                throw Error('encodeByteArray takes an array as a parameter');
            }
            this.init_();
            const byteToCharMap = webSafe
                ? this.byteToCharMapWebSafe_
                : this.byteToCharMap_;
            const output = [];
            for (let i = 0; i < input.length; i += 3) {
                const byte1 = input[i];
                const haveByte2 = i + 1 < input.length;
                const byte2 = haveByte2 ? input[i + 1] : 0;
                const haveByte3 = i + 2 < input.length;
                const byte3 = haveByte3 ? input[i + 2] : 0;
                const outByte1 = byte1 >> 2;
                const outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
                let outByte3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
                let outByte4 = byte3 & 0x3f;
                if (!haveByte3) {
                    outByte4 = 64;
                    if (!haveByte2) {
                        outByte3 = 64;
                    }
                }
                output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
            }
            return output.join('');
        },
        /**
         * Base64-encode a string.
         *
         * @param input A string to encode.
         * @param webSafe If true, we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeString(input, webSafe) {
            // Shortcut for Mozilla browsers that implement
            // a native base64 encoder in the form of "btoa/atob"
            if (this.HAS_NATIVE_SUPPORT && !webSafe) {
                return btoa(input);
            }
            return this.encodeByteArray(stringToByteArray$1(input), webSafe);
        },
        /**
         * Base64-decode a string.
         *
         * @param input to decode.
         * @param webSafe True if we should use the
         *     alternative alphabet.
         * @return string representing the decoded value.
         */
        decodeString(input, webSafe) {
            // Shortcut for Mozilla browsers that implement
            // a native base64 encoder in the form of "btoa/atob"
            if (this.HAS_NATIVE_SUPPORT && !webSafe) {
                return atob(input);
            }
            return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
        },
        /**
         * Base64-decode a string.
         *
         * In base-64 decoding, groups of four characters are converted into three
         * bytes.  If the encoder did not apply padding, the input length may not
         * be a multiple of 4.
         *
         * In this case, the last group will have fewer than 4 characters, and
         * padding will be inferred.  If the group has one or two characters, it decodes
         * to one byte.  If the group has three characters, it decodes to two bytes.
         *
         * @param input Input to decode.
         * @param webSafe True if we should use the web-safe alphabet.
         * @return bytes representing the decoded value.
         */
        decodeStringToByteArray(input, webSafe) {
            this.init_();
            const charToByteMap = webSafe
                ? this.charToByteMapWebSafe_
                : this.charToByteMap_;
            const output = [];
            for (let i = 0; i < input.length;) {
                const byte1 = charToByteMap[input.charAt(i++)];
                const haveByte2 = i < input.length;
                const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
                ++i;
                const haveByte3 = i < input.length;
                const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
                ++i;
                const haveByte4 = i < input.length;
                const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
                ++i;
                if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
                    throw new DecodeBase64StringError();
                }
                const outByte1 = (byte1 << 2) | (byte2 >> 4);
                output.push(outByte1);
                if (byte3 !== 64) {
                    const outByte2 = ((byte2 << 4) & 0xf0) | (byte3 >> 2);
                    output.push(outByte2);
                    if (byte4 !== 64) {
                        const outByte3 = ((byte3 << 6) & 0xc0) | byte4;
                        output.push(outByte3);
                    }
                }
            }
            return output;
        },
        /**
         * Lazy static initialization function. Called before
         * accessing any of the static map variables.
         * @private
         */
        init_() {
            if (!this.byteToCharMap_) {
                this.byteToCharMap_ = {};
                this.charToByteMap_ = {};
                this.byteToCharMapWebSafe_ = {};
                this.charToByteMapWebSafe_ = {};
                // We want quick mappings back and forth, so we precompute two maps.
                for (let i = 0; i < this.ENCODED_VALS.length; i++) {
                    this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
                    this.charToByteMap_[this.byteToCharMap_[i]] = i;
                    this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
                    this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
                    // Be forgiving when decoding and correctly decode both encodings.
                    if (i >= this.ENCODED_VALS_BASE.length) {
                        this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                        this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
                    }
                }
            }
        }
    };
    /**
     * An error encountered while decoding base64 string.
     */
    class DecodeBase64StringError extends Error {
        constructor() {
            super(...arguments);
            this.name = 'DecodeBase64StringError';
        }
    }
    /**
     * URL-safe base64 encoding
     */
    const base64Encode = function (str) {
        const utf8Bytes = stringToByteArray$1(str);
        return base64.encodeByteArray(utf8Bytes, true);
    };
    /**
     * URL-safe base64 encoding (without "." padding in the end).
     * e.g. Used in JSON Web Token (JWT) parts.
     */
    const base64urlEncodeWithoutPadding = function (str) {
        // Use base64url encoding and remove padding in the end (dot characters).
        return base64Encode(str).replace(/\./g, '');
    };
    /**
     * URL-safe base64 decoding
     *
     * NOTE: DO NOT use the global atob() function - it does NOT support the
     * base64Url variant encoding.
     *
     * @param str To be decoded
     * @return Decoded result, if possible
     */
    const base64Decode = function (str) {
        try {
            return base64.decodeString(str, true);
        }
        catch (e) {
            console.error('base64Decode failed: ', e);
        }
        return null;
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Do a deep-copy of basic JavaScript Objects or Arrays.
     */
    function deepCopy(value) {
        return deepExtend(undefined, value);
    }
    /**
     * Copy properties from source to target (recursively allows extension
     * of Objects and Arrays).  Scalar values in the target are over-written.
     * If target is undefined, an object of the appropriate type will be created
     * (and returned).
     *
     * We recursively copy all child properties of plain Objects in the source- so
     * that namespace- like dictionaries are merged.
     *
     * Note that the target can be a function, in which case the properties in
     * the source Object are copied onto it as static properties of the Function.
     *
     * Note: we don't merge __proto__ to prevent prototype pollution
     */
    function deepExtend(target, source) {
        if (!(source instanceof Object)) {
            return source;
        }
        switch (source.constructor) {
            case Date:
                // Treat Dates like scalars; if the target date object had any child
                // properties - they will be lost!
                const dateValue = source;
                return new Date(dateValue.getTime());
            case Object:
                if (target === undefined) {
                    target = {};
                }
                break;
            case Array:
                // Always copy the array source and overwrite the target.
                target = [];
                break;
            default:
                // Not a plain Object - treat it as a scalar.
                return source;
        }
        for (const prop in source) {
            // use isValidKey to guard against prototype pollution. See https://snyk.io/vuln/SNYK-JS-LODASH-450202
            if (!source.hasOwnProperty(prop) || !isValidKey$1(prop)) {
                continue;
            }
            target[prop] = deepExtend(target[prop], source[prop]);
        }
        return target;
    }
    function isValidKey$1(key) {
        return key !== '__proto__';
    }

    /**
     * @license
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Polyfill for `globalThis` object.
     * @returns the `globalThis` object for the given environment.
     * @public
     */
    function getGlobal() {
        if (typeof self !== 'undefined') {
            return self;
        }
        if (typeof window !== 'undefined') {
            return window;
        }
        if (typeof global !== 'undefined') {
            return global;
        }
        throw new Error('Unable to locate global object.');
    }

    /**
     * @license
     * Copyright 2022 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
    /**
     * Attempt to read defaults from a JSON string provided to
     * process(.)env(.)__FIREBASE_DEFAULTS__ or a JSON file whose path is in
     * process(.)env(.)__FIREBASE_DEFAULTS_PATH__
     * The dots are in parens because certain compilers (Vite?) cannot
     * handle seeing that variable in comments.
     * See https://github.com/firebase/firebase-js-sdk/issues/6838
     */
    const getDefaultsFromEnvVariable = () => {
        if (typeof process === 'undefined' || typeof process.env === 'undefined') {
            return;
        }
        const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
        if (defaultsJsonString) {
            return JSON.parse(defaultsJsonString);
        }
    };
    const getDefaultsFromCookie = () => {
        if (typeof document === 'undefined') {
            return;
        }
        let match;
        try {
            match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
        }
        catch (e) {
            // Some environments such as Angular Universal SSR have a
            // `document` object but error on accessing `document.cookie`.
            return;
        }
        const decoded = match && base64Decode(match[1]);
        return decoded && JSON.parse(decoded);
    };
    /**
     * Get the __FIREBASE_DEFAULTS__ object. It checks in order:
     * (1) if such an object exists as a property of `globalThis`
     * (2) if such an object was provided on a shell environment variable
     * (3) if such an object exists in a cookie
     * @public
     */
    const getDefaults = () => {
        try {
            return (getDefaultsFromGlobal() ||
                getDefaultsFromEnvVariable() ||
                getDefaultsFromCookie());
        }
        catch (e) {
            /**
             * Catch-all for being unable to get __FIREBASE_DEFAULTS__ due
             * to any environment case we have not accounted for. Log to
             * info instead of swallowing so we can find these unknown cases
             * and add paths for them if needed.
             */
            console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
            return;
        }
    };
    /**
     * Returns emulator host stored in the __FIREBASE_DEFAULTS__ object
     * for the given product.
     * @returns a URL host formatted like `127.0.0.1:9999` or `[::1]:4000` if available
     * @public
     */
    const getDefaultEmulatorHost = (productName) => { var _a, _b; return (_b = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.emulatorHosts) === null || _b === void 0 ? void 0 : _b[productName]; };
    /**
     * Returns emulator hostname and port stored in the __FIREBASE_DEFAULTS__ object
     * for the given product.
     * @returns a pair of hostname and port like `["::1", 4000]` if available
     * @public
     */
    const getDefaultEmulatorHostnameAndPort = (productName) => {
        const host = getDefaultEmulatorHost(productName);
        if (!host) {
            return undefined;
        }
        const separatorIndex = host.lastIndexOf(':'); // Finding the last since IPv6 addr also has colons.
        if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
            throw new Error(`Invalid host ${host} with no separate hostname and port!`);
        }
        // eslint-disable-next-line no-restricted-globals
        const port = parseInt(host.substring(separatorIndex + 1), 10);
        if (host[0] === '[') {
            // Bracket-quoted `[ipv6addr]:port` => return "ipv6addr" (without brackets).
            return [host.substring(1, separatorIndex - 1), port];
        }
        else {
            return [host.substring(0, separatorIndex), port];
        }
    };
    /**
     * Returns Firebase app config stored in the __FIREBASE_DEFAULTS__ object.
     * @public
     */
    const getDefaultAppConfig = () => { var _a; return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config; };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class Deferred {
        constructor() {
            this.reject = () => { };
            this.resolve = () => { };
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        }
        /**
         * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
         * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
         * and returns a node-style callback which will resolve or reject the Deferred's promise.
         */
        wrapCallback(callback) {
            return (error, value) => {
                if (error) {
                    this.reject(error);
                }
                else {
                    this.resolve(value);
                }
                if (typeof callback === 'function') {
                    // Attaching noop handler just in case developer wasn't expecting
                    // promises
                    this.promise.catch(() => { });
                    // Some of our callbacks don't expect a value and our own tests
                    // assert that the parameter length is 1
                    if (callback.length === 1) {
                        callback(error);
                    }
                    else {
                        callback(error, value);
                    }
                }
            };
        }
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function createMockUserToken(token, projectId) {
        if (token.uid) {
            throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
        }
        // Unsecured JWTs use "none" as the algorithm.
        const header = {
            alg: 'none',
            type: 'JWT'
        };
        const project = projectId || 'demo-project';
        const iat = token.iat || 0;
        const sub = token.sub || token.user_id;
        if (!sub) {
            throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
        }
        const payload = Object.assign({ 
            // Set all required fields to decent defaults
            iss: `https://securetoken.google.com/${project}`, aud: project, iat, exp: iat + 3600, auth_time: iat, sub, user_id: sub, firebase: {
                sign_in_provider: 'custom',
                identities: {}
            } }, token);
        // Unsecured JWTs use the empty string as a signature.
        const signature = '';
        return [
            base64urlEncodeWithoutPadding(JSON.stringify(header)),
            base64urlEncodeWithoutPadding(JSON.stringify(payload)),
            signature
        ].join('.');
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Returns navigator.userAgent string or '' if it's not defined.
     * @return user agent string
     */
    function getUA() {
        if (typeof navigator !== 'undefined' &&
            typeof navigator['userAgent'] === 'string') {
            return navigator['userAgent'];
        }
        else {
            return '';
        }
    }
    /**
     * Detect Cordova / PhoneGap / Ionic frameworks on a mobile device.
     *
     * Deliberately does not rely on checking `file://` URLs (as this fails PhoneGap
     * in the Ripple emulator) nor Cordova `onDeviceReady`, which would normally
     * wait for a callback.
     */
    function isMobileCordova() {
        return (typeof window !== 'undefined' &&
            // @ts-ignore Setting up an broadly applicable index signature for Window
            // just to deal with this case would probably be a bad idea.
            !!(window['cordova'] || window['phonegap'] || window['PhoneGap']) &&
            /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA()));
    }
    /**
     * Detect React Native.
     *
     * @return true if ReactNative environment is detected.
     */
    function isReactNative() {
        return (typeof navigator === 'object' && navigator['product'] === 'ReactNative');
    }
    /**
     * Detect whether the current SDK build is the Node version.
     *
     * @return true if it's the Node SDK build.
     */
    function isNodeSdk() {
        return CONSTANTS.NODE_ADMIN === true;
    }
    /**
     * This method checks if indexedDB is supported by current browser/service worker context
     * @return true if indexedDB is supported by current browser/service worker context
     */
    function isIndexedDBAvailable() {
        try {
            return typeof indexedDB === 'object';
        }
        catch (e) {
            return false;
        }
    }
    /**
     * This method validates browser/sw context for indexedDB by opening a dummy indexedDB database and reject
     * if errors occur during the database open operation.
     *
     * @throws exception if current browser/sw context can't run idb.open (ex: Safari iframe, Firefox
     * private browsing)
     */
    function validateIndexedDBOpenable() {
        return new Promise((resolve, reject) => {
            try {
                let preExist = true;
                const DB_CHECK_NAME = 'validate-browser-context-for-indexeddb-analytics-module';
                const request = self.indexedDB.open(DB_CHECK_NAME);
                request.onsuccess = () => {
                    request.result.close();
                    // delete database only when it doesn't pre-exist
                    if (!preExist) {
                        self.indexedDB.deleteDatabase(DB_CHECK_NAME);
                    }
                    resolve(true);
                };
                request.onupgradeneeded = () => {
                    preExist = false;
                };
                request.onerror = () => {
                    var _a;
                    reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || '');
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @fileoverview Standardized Firebase Error.
     *
     * Usage:
     *
     *   // Typescript string literals for type-safe codes
     *   type Err =
     *     'unknown' |
     *     'object-not-found'
     *     ;
     *
     *   // Closure enum for type-safe error codes
     *   // at-enum {string}
     *   var Err = {
     *     UNKNOWN: 'unknown',
     *     OBJECT_NOT_FOUND: 'object-not-found',
     *   }
     *
     *   let errors: Map<Err, string> = {
     *     'generic-error': "Unknown error",
     *     'file-not-found': "Could not find file: {$file}",
     *   };
     *
     *   // Type-safe function - must pass a valid error code as param.
     *   let error = new ErrorFactory<Err>('service', 'Service', errors);
     *
     *   ...
     *   throw error.create(Err.GENERIC);
     *   ...
     *   throw error.create(Err.FILE_NOT_FOUND, {'file': fileName});
     *   ...
     *   // Service: Could not file file: foo.txt (service/file-not-found).
     *
     *   catch (e) {
     *     assert(e.message === "Could not find file: foo.txt.");
     *     if ((e as FirebaseError)?.code === 'service/file-not-found') {
     *       console.log("Could not read file: " + e['file']);
     *     }
     *   }
     */
    const ERROR_NAME = 'FirebaseError';
    // Based on code from:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
    class FirebaseError extends Error {
        constructor(
        /** The error code for this error. */
        code, message, 
        /** Custom data for this error. */
        customData) {
            super(message);
            this.code = code;
            this.customData = customData;
            /** The custom name for all FirebaseErrors. */
            this.name = ERROR_NAME;
            // Fix For ES5
            // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
            Object.setPrototypeOf(this, FirebaseError.prototype);
            // Maintains proper stack trace for where our error was thrown.
            // Only available on V8.
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, ErrorFactory.prototype.create);
            }
        }
    }
    class ErrorFactory {
        constructor(service, serviceName, errors) {
            this.service = service;
            this.serviceName = serviceName;
            this.errors = errors;
        }
        create(code, ...data) {
            const customData = data[0] || {};
            const fullCode = `${this.service}/${code}`;
            const template = this.errors[code];
            const message = template ? replaceTemplate(template, customData) : 'Error';
            // Service Name: Error message (service/code).
            const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
            const error = new FirebaseError(fullCode, fullMessage, customData);
            return error;
        }
    }
    function replaceTemplate(template, data) {
        return template.replace(PATTERN, (_, key) => {
            const value = data[key];
            return value != null ? String(value) : `<${key}?>`;
        });
    }
    const PATTERN = /\{\$([^}]+)}/g;

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Evaluates a JSON string into a javascript object.
     *
     * @param {string} str A string containing JSON.
     * @return {*} The javascript object representing the specified JSON.
     */
    function jsonEval(str) {
        return JSON.parse(str);
    }
    /**
     * Returns JSON representing a javascript object.
     * @param {*} data Javascript object to be stringified.
     * @return {string} The JSON contents of the object.
     */
    function stringify(data) {
        return JSON.stringify(data);
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Decodes a Firebase auth. token into constituent parts.
     *
     * Notes:
     * - May return with invalid / incomplete claims if there's no native base64 decoding support.
     * - Doesn't check if the token is actually valid.
     */
    const decode = function (token) {
        let header = {}, claims = {}, data = {}, signature = '';
        try {
            const parts = token.split('.');
            header = jsonEval(base64Decode(parts[0]) || '');
            claims = jsonEval(base64Decode(parts[1]) || '');
            signature = parts[2];
            data = claims['d'] || {};
            delete claims['d'];
        }
        catch (e) { }
        return {
            header,
            claims,
            data,
            signature
        };
    };
    /**
     * Decodes a Firebase auth. token and checks the validity of its format. Expects a valid issued-at time.
     *
     * Notes:
     * - May return a false negative if there's no native base64 decoding support.
     * - Doesn't check if the token is actually valid.
     */
    const isValidFormat = function (token) {
        const decoded = decode(token), claims = decoded.claims;
        return !!claims && typeof claims === 'object' && claims.hasOwnProperty('iat');
    };
    /**
     * Attempts to peer into an auth token and determine if it's an admin auth token by looking at the claims portion.
     *
     * Notes:
     * - May return a false negative if there's no native base64 decoding support.
     * - Doesn't check if the token is actually valid.
     */
    const isAdmin = function (token) {
        const claims = decode(token).claims;
        return typeof claims === 'object' && claims['admin'] === true;
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function contains(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    }
    function safeGet(obj, key) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
        }
        else {
            return undefined;
        }
    }
    function isEmpty(obj) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
    function map(obj, fn, contextObj) {
        const res = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                res[key] = fn.call(contextObj, obj[key], key, obj);
            }
        }
        return res;
    }
    /**
     * Deep equal two objects. Support Arrays and Objects.
     */
    function deepEqual(a, b) {
        if (a === b) {
            return true;
        }
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        for (const k of aKeys) {
            if (!bKeys.includes(k)) {
                return false;
            }
            const aProp = a[k];
            const bProp = b[k];
            if (isObject(aProp) && isObject(bProp)) {
                if (!deepEqual(aProp, bProp)) {
                    return false;
                }
            }
            else if (aProp !== bProp) {
                return false;
            }
        }
        for (const k of bKeys) {
            if (!aKeys.includes(k)) {
                return false;
            }
        }
        return true;
    }
    function isObject(thing) {
        return thing !== null && typeof thing === 'object';
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Returns a querystring-formatted string (e.g. &arg=val&arg2=val2) from a
     * params object (e.g. {arg: 'val', arg2: 'val2'})
     * Note: You must prepend it with ? when adding it to a URL.
     */
    function querystring(querystringParams) {
        const params = [];
        for (const [key, value] of Object.entries(querystringParams)) {
            if (Array.isArray(value)) {
                value.forEach(arrayVal => {
                    params.push(encodeURIComponent(key) + '=' + encodeURIComponent(arrayVal));
                });
            }
            else {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            }
        }
        return params.length ? '&' + params.join('&') : '';
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @fileoverview SHA-1 cryptographic hash.
     * Variable names follow the notation in FIPS PUB 180-3:
     * http://csrc.nist.gov/publications/fips/fips180-3/fips180-3_final.pdf.
     *
     * Usage:
     *   var sha1 = new sha1();
     *   sha1.update(bytes);
     *   var hash = sha1.digest();
     *
     * Performance:
     *   Chrome 23:   ~400 Mbit/s
     *   Firefox 16:  ~250 Mbit/s
     *
     */
    /**
     * SHA-1 cryptographic hash constructor.
     *
     * The properties declared here are discussed in the above algorithm document.
     * @constructor
     * @final
     * @struct
     */
    class Sha1 {
        constructor() {
            /**
             * Holds the previous values of accumulated variables a-e in the compress_
             * function.
             * @private
             */
            this.chain_ = [];
            /**
             * A buffer holding the partially computed hash result.
             * @private
             */
            this.buf_ = [];
            /**
             * An array of 80 bytes, each a part of the message to be hashed.  Referred to
             * as the message schedule in the docs.
             * @private
             */
            this.W_ = [];
            /**
             * Contains data needed to pad messages less than 64 bytes.
             * @private
             */
            this.pad_ = [];
            /**
             * @private {number}
             */
            this.inbuf_ = 0;
            /**
             * @private {number}
             */
            this.total_ = 0;
            this.blockSize = 512 / 8;
            this.pad_[0] = 128;
            for (let i = 1; i < this.blockSize; ++i) {
                this.pad_[i] = 0;
            }
            this.reset();
        }
        reset() {
            this.chain_[0] = 0x67452301;
            this.chain_[1] = 0xefcdab89;
            this.chain_[2] = 0x98badcfe;
            this.chain_[3] = 0x10325476;
            this.chain_[4] = 0xc3d2e1f0;
            this.inbuf_ = 0;
            this.total_ = 0;
        }
        /**
         * Internal compress helper function.
         * @param buf Block to compress.
         * @param offset Offset of the block in the buffer.
         * @private
         */
        compress_(buf, offset) {
            if (!offset) {
                offset = 0;
            }
            const W = this.W_;
            // get 16 big endian words
            if (typeof buf === 'string') {
                for (let i = 0; i < 16; i++) {
                    // TODO(user): [bug 8140122] Recent versions of Safari for Mac OS and iOS
                    // have a bug that turns the post-increment ++ operator into pre-increment
                    // during JIT compilation.  We have code that depends heavily on SHA-1 for
                    // correctness and which is affected by this bug, so I've removed all uses
                    // of post-increment ++ in which the result value is used.  We can revert
                    // this change once the Safari bug
                    // (https://bugs.webkit.org/show_bug.cgi?id=109036) has been fixed and
                    // most clients have been updated.
                    W[i] =
                        (buf.charCodeAt(offset) << 24) |
                            (buf.charCodeAt(offset + 1) << 16) |
                            (buf.charCodeAt(offset + 2) << 8) |
                            buf.charCodeAt(offset + 3);
                    offset += 4;
                }
            }
            else {
                for (let i = 0; i < 16; i++) {
                    W[i] =
                        (buf[offset] << 24) |
                            (buf[offset + 1] << 16) |
                            (buf[offset + 2] << 8) |
                            buf[offset + 3];
                    offset += 4;
                }
            }
            // expand to 80 words
            for (let i = 16; i < 80; i++) {
                const t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                W[i] = ((t << 1) | (t >>> 31)) & 0xffffffff;
            }
            let a = this.chain_[0];
            let b = this.chain_[1];
            let c = this.chain_[2];
            let d = this.chain_[3];
            let e = this.chain_[4];
            let f, k;
            // TODO(user): Try to unroll this loop to speed up the computation.
            for (let i = 0; i < 80; i++) {
                if (i < 40) {
                    if (i < 20) {
                        f = d ^ (b & (c ^ d));
                        k = 0x5a827999;
                    }
                    else {
                        f = b ^ c ^ d;
                        k = 0x6ed9eba1;
                    }
                }
                else {
                    if (i < 60) {
                        f = (b & c) | (d & (b | c));
                        k = 0x8f1bbcdc;
                    }
                    else {
                        f = b ^ c ^ d;
                        k = 0xca62c1d6;
                    }
                }
                const t = (((a << 5) | (a >>> 27)) + f + e + k + W[i]) & 0xffffffff;
                e = d;
                d = c;
                c = ((b << 30) | (b >>> 2)) & 0xffffffff;
                b = a;
                a = t;
            }
            this.chain_[0] = (this.chain_[0] + a) & 0xffffffff;
            this.chain_[1] = (this.chain_[1] + b) & 0xffffffff;
            this.chain_[2] = (this.chain_[2] + c) & 0xffffffff;
            this.chain_[3] = (this.chain_[3] + d) & 0xffffffff;
            this.chain_[4] = (this.chain_[4] + e) & 0xffffffff;
        }
        update(bytes, length) {
            // TODO(johnlenz): tighten the function signature and remove this check
            if (bytes == null) {
                return;
            }
            if (length === undefined) {
                length = bytes.length;
            }
            const lengthMinusBlock = length - this.blockSize;
            let n = 0;
            // Using local instead of member variables gives ~5% speedup on Firefox 16.
            const buf = this.buf_;
            let inbuf = this.inbuf_;
            // The outer while loop should execute at most twice.
            while (n < length) {
                // When we have no data in the block to top up, we can directly process the
                // input buffer (assuming it contains sufficient data). This gives ~25%
                // speedup on Chrome 23 and ~15% speedup on Firefox 16, but requires that
                // the data is provided in large chunks (or in multiples of 64 bytes).
                if (inbuf === 0) {
                    while (n <= lengthMinusBlock) {
                        this.compress_(bytes, n);
                        n += this.blockSize;
                    }
                }
                if (typeof bytes === 'string') {
                    while (n < length) {
                        buf[inbuf] = bytes.charCodeAt(n);
                        ++inbuf;
                        ++n;
                        if (inbuf === this.blockSize) {
                            this.compress_(buf);
                            inbuf = 0;
                            // Jump to the outer loop so we use the full-block optimization.
                            break;
                        }
                    }
                }
                else {
                    while (n < length) {
                        buf[inbuf] = bytes[n];
                        ++inbuf;
                        ++n;
                        if (inbuf === this.blockSize) {
                            this.compress_(buf);
                            inbuf = 0;
                            // Jump to the outer loop so we use the full-block optimization.
                            break;
                        }
                    }
                }
            }
            this.inbuf_ = inbuf;
            this.total_ += length;
        }
        /** @override */
        digest() {
            const digest = [];
            let totalBits = this.total_ * 8;
            // Add pad 0x80 0x00*.
            if (this.inbuf_ < 56) {
                this.update(this.pad_, 56 - this.inbuf_);
            }
            else {
                this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
            }
            // Add # bits.
            for (let i = this.blockSize - 1; i >= 56; i--) {
                this.buf_[i] = totalBits & 255;
                totalBits /= 256; // Don't use bit-shifting here!
            }
            this.compress_(this.buf_);
            let n = 0;
            for (let i = 0; i < 5; i++) {
                for (let j = 24; j >= 0; j -= 8) {
                    digest[n] = (this.chain_[i] >> j) & 255;
                    ++n;
                }
            }
            return digest;
        }
    }
    /**
     * Generates a string to prefix an error message about failed argument validation
     *
     * @param fnName The function name
     * @param argName The name of the argument
     * @return The prefix to add to the error thrown for validation.
     */
    function errorPrefix(fnName, argName) {
        return `${fnName} failed: ${argName} argument `;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // Code originally came from goog.crypt.stringToUtf8ByteArray, but for some reason they
    // automatically replaced '\r\n' with '\n', and they didn't handle surrogate pairs,
    // so it's been modified.
    // Note that not all Unicode characters appear as single characters in JavaScript strings.
    // fromCharCode returns the UTF-16 encoding of a character - so some Unicode characters
    // use 2 characters in Javascript.  All 4-byte UTF-8 characters begin with a first
    // character in the range 0xD800 - 0xDBFF (the first character of a so-called surrogate
    // pair).
    // See http://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3
    /**
     * @param {string} str
     * @return {Array}
     */
    const stringToByteArray = function (str) {
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            // Is this the lead surrogate in a surrogate pair?
            if (c >= 0xd800 && c <= 0xdbff) {
                const high = c - 0xd800; // the high 10 bits.
                i++;
                assert(i < str.length, 'Surrogate pair missing trail surrogate.');
                const low = str.charCodeAt(i) - 0xdc00; // the low 10 bits.
                c = 0x10000 + (high << 10) + low;
            }
            if (c < 128) {
                out[p++] = c;
            }
            else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            }
            else if (c < 65536) {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
            else {
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return out;
    };
    /**
     * Calculate length without actually converting; useful for doing cheaper validation.
     * @param {string} str
     * @return {number}
     */
    const stringLength = function (str) {
        let p = 0;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            if (c < 128) {
                p++;
            }
            else if (c < 2048) {
                p += 2;
            }
            else if (c >= 0xd800 && c <= 0xdbff) {
                // Lead surrogate of a surrogate pair.  The pair together will take 4 bytes to represent.
                p += 4;
                i++; // skip trail surrogate.
            }
            else {
                p += 3;
            }
        }
        return p;
    };

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function getModularInstance(service) {
        if (service && service._delegate) {
            return service._delegate;
        }
        else {
            return service;
        }
    }

    /**
     * Component for service name T, e.g. `auth`, `auth-internal`
     */
    class Component {
        /**
         *
         * @param name The public service name, e.g. app, auth, firestore, database
         * @param instanceFactory Service factory responsible for creating the public interface
         * @param type whether the service provided by the component is public or private
         */
        constructor(name, instanceFactory, type) {
            this.name = name;
            this.instanceFactory = instanceFactory;
            this.type = type;
            this.multipleInstances = false;
            /**
             * Properties to be added to the service namespace
             */
            this.serviceProps = {};
            this.instantiationMode = "LAZY" /* InstantiationMode.LAZY */;
            this.onInstanceCreated = null;
        }
        setInstantiationMode(mode) {
            this.instantiationMode = mode;
            return this;
        }
        setMultipleInstances(multipleInstances) {
            this.multipleInstances = multipleInstances;
            return this;
        }
        setServiceProps(props) {
            this.serviceProps = props;
            return this;
        }
        setInstanceCreatedCallback(callback) {
            this.onInstanceCreated = callback;
            return this;
        }
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const DEFAULT_ENTRY_NAME$1 = '[DEFAULT]';

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Provider for instance for service name T, e.g. 'auth', 'auth-internal'
     * NameServiceMapping[T] is an alias for the type of the instance
     */
    class Provider {
        constructor(name, container) {
            this.name = name;
            this.container = container;
            this.component = null;
            this.instances = new Map();
            this.instancesDeferred = new Map();
            this.instancesOptions = new Map();
            this.onInitCallbacks = new Map();
        }
        /**
         * @param identifier A provider can provide mulitple instances of a service
         * if this.component.multipleInstances is true.
         */
        get(identifier) {
            // if multipleInstances is not supported, use the default name
            const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
            if (!this.instancesDeferred.has(normalizedIdentifier)) {
                const deferred = new Deferred();
                this.instancesDeferred.set(normalizedIdentifier, deferred);
                if (this.isInitialized(normalizedIdentifier) ||
                    this.shouldAutoInitialize()) {
                    // initialize the service if it can be auto-initialized
                    try {
                        const instance = this.getOrInitializeService({
                            instanceIdentifier: normalizedIdentifier
                        });
                        if (instance) {
                            deferred.resolve(instance);
                        }
                    }
                    catch (e) {
                        // when the instance factory throws an exception during get(), it should not cause
                        // a fatal error. We just return the unresolved promise in this case.
                    }
                }
            }
            return this.instancesDeferred.get(normalizedIdentifier).promise;
        }
        getImmediate(options) {
            var _a;
            // if multipleInstances is not supported, use the default name
            const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
            const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
            if (this.isInitialized(normalizedIdentifier) ||
                this.shouldAutoInitialize()) {
                try {
                    return this.getOrInitializeService({
                        instanceIdentifier: normalizedIdentifier
                    });
                }
                catch (e) {
                    if (optional) {
                        return null;
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                // In case a component is not initialized and should/can not be auto-initialized at the moment, return null if the optional flag is set, or throw
                if (optional) {
                    return null;
                }
                else {
                    throw Error(`Service ${this.name} is not available`);
                }
            }
        }
        getComponent() {
            return this.component;
        }
        setComponent(component) {
            if (component.name !== this.name) {
                throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
            }
            if (this.component) {
                throw Error(`Component for ${this.name} has already been provided`);
            }
            this.component = component;
            // return early without attempting to initialize the component if the component requires explicit initialization (calling `Provider.initialize()`)
            if (!this.shouldAutoInitialize()) {
                return;
            }
            // if the service is eager, initialize the default instance
            if (isComponentEager(component)) {
                try {
                    this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME$1 });
                }
                catch (e) {
                    // when the instance factory for an eager Component throws an exception during the eager
                    // initialization, it should not cause a fatal error.
                    // TODO: Investigate if we need to make it configurable, because some component may want to cause
                    // a fatal error in this case?
                }
            }
            // Create service instances for the pending promises and resolve them
            // NOTE: if this.multipleInstances is false, only the default instance will be created
            // and all promises with resolve with it regardless of the identifier.
            for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
                const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                try {
                    // `getOrInitializeService()` should always return a valid instance since a component is guaranteed. use ! to make typescript happy.
                    const instance = this.getOrInitializeService({
                        instanceIdentifier: normalizedIdentifier
                    });
                    instanceDeferred.resolve(instance);
                }
                catch (e) {
                    // when the instance factory throws an exception, it should not cause
                    // a fatal error. We just leave the promise unresolved.
                }
            }
        }
        clearInstance(identifier = DEFAULT_ENTRY_NAME$1) {
            this.instancesDeferred.delete(identifier);
            this.instancesOptions.delete(identifier);
            this.instances.delete(identifier);
        }
        // app.delete() will call this method on every provider to delete the services
        // TODO: should we mark the provider as deleted?
        async delete() {
            const services = Array.from(this.instances.values());
            await Promise.all([
                ...services
                    .filter(service => 'INTERNAL' in service) // legacy services
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map(service => service.INTERNAL.delete()),
                ...services
                    .filter(service => '_delete' in service) // modularized services
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map(service => service._delete())
            ]);
        }
        isComponentSet() {
            return this.component != null;
        }
        isInitialized(identifier = DEFAULT_ENTRY_NAME$1) {
            return this.instances.has(identifier);
        }
        getOptions(identifier = DEFAULT_ENTRY_NAME$1) {
            return this.instancesOptions.get(identifier) || {};
        }
        initialize(opts = {}) {
            const { options = {} } = opts;
            const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
            if (this.isInitialized(normalizedIdentifier)) {
                throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
            }
            if (!this.isComponentSet()) {
                throw Error(`Component ${this.name} has not been registered yet`);
            }
            const instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier,
                options
            });
            // resolve any pending promise waiting for the service instance
            for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
                const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
                if (normalizedIdentifier === normalizedDeferredIdentifier) {
                    instanceDeferred.resolve(instance);
                }
            }
            return instance;
        }
        /**
         *
         * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
         * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
         *
         * @param identifier An optional instance identifier
         * @returns a function to unregister the callback
         */
        onInit(callback, identifier) {
            var _a;
            const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
            const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : new Set();
            existingCallbacks.add(callback);
            this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
            const existingInstance = this.instances.get(normalizedIdentifier);
            if (existingInstance) {
                callback(existingInstance, normalizedIdentifier);
            }
            return () => {
                existingCallbacks.delete(callback);
            };
        }
        /**
         * Invoke onInit callbacks synchronously
         * @param instance the service instance`
         */
        invokeOnInitCallbacks(instance, identifier) {
            const callbacks = this.onInitCallbacks.get(identifier);
            if (!callbacks) {
                return;
            }
            for (const callback of callbacks) {
                try {
                    callback(instance, identifier);
                }
                catch (_a) {
                    // ignore errors in the onInit callback
                }
            }
        }
        getOrInitializeService({ instanceIdentifier, options = {} }) {
            let instance = this.instances.get(instanceIdentifier);
            if (!instance && this.component) {
                instance = this.component.instanceFactory(this.container, {
                    instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
                    options
                });
                this.instances.set(instanceIdentifier, instance);
                this.instancesOptions.set(instanceIdentifier, options);
                /**
                 * Invoke onInit listeners.
                 * Note this.component.onInstanceCreated is different, which is used by the component creator,
                 * while onInit listeners are registered by consumers of the provider.
                 */
                this.invokeOnInitCallbacks(instance, instanceIdentifier);
                /**
                 * Order is important
                 * onInstanceCreated() should be called after this.instances.set(instanceIdentifier, instance); which
                 * makes `isInitialized()` return true.
                 */
                if (this.component.onInstanceCreated) {
                    try {
                        this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
                    }
                    catch (_a) {
                        // ignore errors in the onInstanceCreatedCallback
                    }
                }
            }
            return instance || null;
        }
        normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME$1) {
            if (this.component) {
                return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME$1;
            }
            else {
                return identifier; // assume multiple instances are supported before the component is provided.
            }
        }
        shouldAutoInitialize() {
            return (!!this.component &&
                this.component.instantiationMode !== "EXPLICIT" /* InstantiationMode.EXPLICIT */);
        }
    }
    // undefined should be passed to the service factory for the default instance
    function normalizeIdentifierForFactory(identifier) {
        return identifier === DEFAULT_ENTRY_NAME$1 ? undefined : identifier;
    }
    function isComponentEager(component) {
        return component.instantiationMode === "EAGER" /* InstantiationMode.EAGER */;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * ComponentContainer that provides Providers for service name T, e.g. `auth`, `auth-internal`
     */
    class ComponentContainer {
        constructor(name) {
            this.name = name;
            this.providers = new Map();
        }
        /**
         *
         * @param component Component being added
         * @param overwrite When a component with the same name has already been registered,
         * if overwrite is true: overwrite the existing component with the new component and create a new
         * provider with the new component. It can be useful in tests where you want to use different mocks
         * for different tests.
         * if overwrite is false: throw an exception
         */
        addComponent(component) {
            const provider = this.getProvider(component.name);
            if (provider.isComponentSet()) {
                throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
            }
            provider.setComponent(component);
        }
        addOrOverwriteComponent(component) {
            const provider = this.getProvider(component.name);
            if (provider.isComponentSet()) {
                // delete the existing provider from the container, so we can register the new component
                this.providers.delete(component.name);
            }
            this.addComponent(component);
        }
        /**
         * getProvider provides a type safe interface where it can only be called with a field name
         * present in NameServiceMapping interface.
         *
         * Firebase SDKs providing services should extend NameServiceMapping interface to register
         * themselves.
         */
        getProvider(name) {
            if (this.providers.has(name)) {
                return this.providers.get(name);
            }
            // create a Provider for a service that hasn't registered with Firebase
            const provider = new Provider(name, this);
            this.providers.set(name, provider);
            return provider;
        }
        getProviders() {
            return Array.from(this.providers.values());
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * A container for all of the Logger instances
     */
    /**
     * The JS SDK supports 5 log levels and also allows a user the ability to
     * silence the logs altogether.
     *
     * The order is a follows:
     * DEBUG < VERBOSE < INFO < WARN < ERROR
     *
     * All of the log types above the current log level will be captured (i.e. if
     * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
     * `VERBOSE` logs will not)
     */
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
        LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
        LogLevel[LogLevel["INFO"] = 2] = "INFO";
        LogLevel[LogLevel["WARN"] = 3] = "WARN";
        LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
        LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
    })(LogLevel || (LogLevel = {}));
    const levelStringToEnum = {
        'debug': LogLevel.DEBUG,
        'verbose': LogLevel.VERBOSE,
        'info': LogLevel.INFO,
        'warn': LogLevel.WARN,
        'error': LogLevel.ERROR,
        'silent': LogLevel.SILENT
    };
    /**
     * The default log level
     */
    const defaultLogLevel = LogLevel.INFO;
    /**
     * By default, `console.debug` is not displayed in the developer console (in
     * chrome). To avoid forcing users to have to opt-in to these logs twice
     * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
     * logs to the `console.log` function.
     */
    const ConsoleMethod = {
        [LogLevel.DEBUG]: 'log',
        [LogLevel.VERBOSE]: 'log',
        [LogLevel.INFO]: 'info',
        [LogLevel.WARN]: 'warn',
        [LogLevel.ERROR]: 'error'
    };
    /**
     * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
     * messages on to their corresponding console counterparts (if the log method
     * is supported by the current log level)
     */
    const defaultLogHandler = (instance, logType, ...args) => {
        if (logType < instance.logLevel) {
            return;
        }
        const now = new Date().toISOString();
        const method = ConsoleMethod[logType];
        if (method) {
            console[method](`[${now}]  ${instance.name}:`, ...args);
        }
        else {
            throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
        }
    };
    class Logger {
        /**
         * Gives you an instance of a Logger to capture messages according to
         * Firebase's logging scheme.
         *
         * @param name The name that the logs will be associated with
         */
        constructor(name) {
            this.name = name;
            /**
             * The log level of the given Logger instance.
             */
            this._logLevel = defaultLogLevel;
            /**
             * The main (internal) log handler for the Logger instance.
             * Can be set to a new function in internal package code but not by user.
             */
            this._logHandler = defaultLogHandler;
            /**
             * The optional, additional, user-defined log handler for the Logger instance.
             */
            this._userLogHandler = null;
        }
        get logLevel() {
            return this._logLevel;
        }
        set logLevel(val) {
            if (!(val in LogLevel)) {
                throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
            }
            this._logLevel = val;
        }
        // Workaround for setter/getter having to be the same type.
        setLogLevel(val) {
            this._logLevel = typeof val === 'string' ? levelStringToEnum[val] : val;
        }
        get logHandler() {
            return this._logHandler;
        }
        set logHandler(val) {
            if (typeof val !== 'function') {
                throw new TypeError('Value assigned to `logHandler` must be a function');
            }
            this._logHandler = val;
        }
        get userLogHandler() {
            return this._userLogHandler;
        }
        set userLogHandler(val) {
            this._userLogHandler = val;
        }
        /**
         * The functions below are all based on the `console` interface
         */
        debug(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
            this._logHandler(this, LogLevel.DEBUG, ...args);
        }
        log(...args) {
            this._userLogHandler &&
                this._userLogHandler(this, LogLevel.VERBOSE, ...args);
            this._logHandler(this, LogLevel.VERBOSE, ...args);
        }
        info(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
            this._logHandler(this, LogLevel.INFO, ...args);
        }
        warn(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
            this._logHandler(this, LogLevel.WARN, ...args);
        }
        error(...args) {
            this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
            this._logHandler(this, LogLevel.ERROR, ...args);
        }
    }

    const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

    let idbProxyableTypes;
    let cursorAdvanceMethods;
    // This is a function to prevent it throwing up in node environments.
    function getIdbProxyableTypes() {
        return (idbProxyableTypes ||
            (idbProxyableTypes = [
                IDBDatabase,
                IDBObjectStore,
                IDBIndex,
                IDBCursor,
                IDBTransaction,
            ]));
    }
    // This is a function to prevent it throwing up in node environments.
    function getCursorAdvanceMethods() {
        return (cursorAdvanceMethods ||
            (cursorAdvanceMethods = [
                IDBCursor.prototype.advance,
                IDBCursor.prototype.continue,
                IDBCursor.prototype.continuePrimaryKey,
            ]));
    }
    const cursorRequestMap = new WeakMap();
    const transactionDoneMap = new WeakMap();
    const transactionStoreNamesMap = new WeakMap();
    const transformCache = new WeakMap();
    const reverseTransformCache = new WeakMap();
    function promisifyRequest(request) {
        const promise = new Promise((resolve, reject) => {
            const unlisten = () => {
                request.removeEventListener('success', success);
                request.removeEventListener('error', error);
            };
            const success = () => {
                resolve(wrap(request.result));
                unlisten();
            };
            const error = () => {
                reject(request.error);
                unlisten();
            };
            request.addEventListener('success', success);
            request.addEventListener('error', error);
        });
        promise
            .then((value) => {
            // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
            // (see wrapFunction).
            if (value instanceof IDBCursor) {
                cursorRequestMap.set(value, request);
            }
            // Catching to avoid "Uncaught Promise exceptions"
        })
            .catch(() => { });
        // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
        // is because we create many promises from a single IDBRequest.
        reverseTransformCache.set(promise, request);
        return promise;
    }
    function cacheDonePromiseForTransaction(tx) {
        // Early bail if we've already created a done promise for this transaction.
        if (transactionDoneMap.has(tx))
            return;
        const done = new Promise((resolve, reject) => {
            const unlisten = () => {
                tx.removeEventListener('complete', complete);
                tx.removeEventListener('error', error);
                tx.removeEventListener('abort', error);
            };
            const complete = () => {
                resolve();
                unlisten();
            };
            const error = () => {
                reject(tx.error || new DOMException('AbortError', 'AbortError'));
                unlisten();
            };
            tx.addEventListener('complete', complete);
            tx.addEventListener('error', error);
            tx.addEventListener('abort', error);
        });
        // Cache it for later retrieval.
        transactionDoneMap.set(tx, done);
    }
    let idbProxyTraps = {
        get(target, prop, receiver) {
            if (target instanceof IDBTransaction) {
                // Special handling for transaction.done.
                if (prop === 'done')
                    return transactionDoneMap.get(target);
                // Polyfill for objectStoreNames because of Edge.
                if (prop === 'objectStoreNames') {
                    return target.objectStoreNames || transactionStoreNamesMap.get(target);
                }
                // Make tx.store return the only store in the transaction, or undefined if there are many.
                if (prop === 'store') {
                    return receiver.objectStoreNames[1]
                        ? undefined
                        : receiver.objectStore(receiver.objectStoreNames[0]);
                }
            }
            // Else transform whatever we get back.
            return wrap(target[prop]);
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        },
        has(target, prop) {
            if (target instanceof IDBTransaction &&
                (prop === 'done' || prop === 'store')) {
                return true;
            }
            return prop in target;
        },
    };
    function replaceTraps(callback) {
        idbProxyTraps = callback(idbProxyTraps);
    }
    function wrapFunction(func) {
        // Due to expected object equality (which is enforced by the caching in `wrap`), we
        // only create one new func per func.
        // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
        if (func === IDBDatabase.prototype.transaction &&
            !('objectStoreNames' in IDBTransaction.prototype)) {
            return function (storeNames, ...args) {
                const tx = func.call(unwrap(this), storeNames, ...args);
                transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
                return wrap(tx);
            };
        }
        // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
        // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
        // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
        // with real promises, so each advance methods returns a new promise for the cursor object, or
        // undefined if the end of the cursor has been reached.
        if (getCursorAdvanceMethods().includes(func)) {
            return function (...args) {
                // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
                // the original object.
                func.apply(unwrap(this), args);
                return wrap(cursorRequestMap.get(this));
            };
        }
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            return wrap(func.apply(unwrap(this), args));
        };
    }
    function transformCachableValue(value) {
        if (typeof value === 'function')
            return wrapFunction(value);
        // This doesn't return, it just creates a 'done' promise for the transaction,
        // which is later returned for transaction.done (see idbObjectHandler).
        if (value instanceof IDBTransaction)
            cacheDonePromiseForTransaction(value);
        if (instanceOfAny(value, getIdbProxyableTypes()))
            return new Proxy(value, idbProxyTraps);
        // Return the same value back if we're not going to transform it.
        return value;
    }
    function wrap(value) {
        // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
        // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
        if (value instanceof IDBRequest)
            return promisifyRequest(value);
        // If we've already transformed this value before, reuse the transformed value.
        // This is faster, but it also provides object equality.
        if (transformCache.has(value))
            return transformCache.get(value);
        const newValue = transformCachableValue(value);
        // Not all types are transformed.
        // These may be primitive types, so they can't be WeakMap keys.
        if (newValue !== value) {
            transformCache.set(value, newValue);
            reverseTransformCache.set(newValue, value);
        }
        return newValue;
    }
    const unwrap = (value) => reverseTransformCache.get(value);

    /**
     * Open a database.
     *
     * @param name Name of the database.
     * @param version Schema version.
     * @param callbacks Additional callbacks.
     */
    function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
        const request = indexedDB.open(name, version);
        const openPromise = wrap(request);
        if (upgrade) {
            request.addEventListener('upgradeneeded', (event) => {
                upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
            });
        }
        if (blocked) {
            request.addEventListener('blocked', (event) => blocked(
            // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
            event.oldVersion, event.newVersion, event));
        }
        openPromise
            .then((db) => {
            if (terminated)
                db.addEventListener('close', () => terminated());
            if (blocking) {
                db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));
            }
        })
            .catch(() => { });
        return openPromise;
    }

    const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
    const writeMethods = ['put', 'add', 'delete', 'clear'];
    const cachedMethods = new Map();
    function getMethod(target, prop) {
        if (!(target instanceof IDBDatabase &&
            !(prop in target) &&
            typeof prop === 'string')) {
            return;
        }
        if (cachedMethods.get(prop))
            return cachedMethods.get(prop);
        const targetFuncName = prop.replace(/FromIndex$/, '');
        const useIndex = prop !== targetFuncName;
        const isWrite = writeMethods.includes(targetFuncName);
        if (
        // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
        !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
            !(isWrite || readMethods.includes(targetFuncName))) {
            return;
        }
        const method = async function (storeName, ...args) {
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
            let target = tx.store;
            if (useIndex)
                target = target.index(args.shift());
            // Must reject if op rejects.
            // If it's a write operation, must reject if tx.done rejects.
            // Must reject with op rejection first.
            // Must resolve with op value.
            // Must handle both promises (no unhandled rejections)
            return (await Promise.all([
                target[targetFuncName](...args),
                isWrite && tx.done,
            ]))[0];
        };
        cachedMethods.set(prop, method);
        return method;
    }
    replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
    }));

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class PlatformLoggerServiceImpl {
        constructor(container) {
            this.container = container;
        }
        // In initial implementation, this will be called by installations on
        // auth token refresh, and installations will send this string.
        getPlatformInfoString() {
            const providers = this.container.getProviders();
            // Loop through providers and get library/version pairs from any that are
            // version components.
            return providers
                .map(provider => {
                if (isVersionServiceProvider(provider)) {
                    const service = provider.getImmediate();
                    return `${service.library}/${service.version}`;
                }
                else {
                    return null;
                }
            })
                .filter(logString => logString)
                .join(' ');
        }
    }
    /**
     *
     * @param provider check if this provider provides a VersionService
     *
     * NOTE: Using Provider<'app-version'> is a hack to indicate that the provider
     * provides VersionService. The provider is not necessarily a 'app-version'
     * provider.
     */
    function isVersionServiceProvider(provider) {
        const component = provider.getComponent();
        return (component === null || component === void 0 ? void 0 : component.type) === "VERSION" /* ComponentType.VERSION */;
    }

    const name$o = "@firebase/app";
    const version$1$1 = "0.9.19";

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const logger$1 = new Logger('@firebase/app');

    const name$n = "@firebase/app-compat";

    const name$m = "@firebase/analytics-compat";

    const name$l = "@firebase/analytics";

    const name$k = "@firebase/app-check-compat";

    const name$j = "@firebase/app-check";

    const name$i = "@firebase/auth";

    const name$h = "@firebase/auth-compat";

    const name$g = "@firebase/database";

    const name$f = "@firebase/database-compat";

    const name$e = "@firebase/functions";

    const name$d = "@firebase/functions-compat";

    const name$c = "@firebase/installations";

    const name$b = "@firebase/installations-compat";

    const name$a = "@firebase/messaging";

    const name$9 = "@firebase/messaging-compat";

    const name$8 = "@firebase/performance";

    const name$7 = "@firebase/performance-compat";

    const name$6 = "@firebase/remote-config";

    const name$5 = "@firebase/remote-config-compat";

    const name$4 = "@firebase/storage";

    const name$3 = "@firebase/storage-compat";

    const name$2 = "@firebase/firestore";

    const name$1$1 = "@firebase/firestore-compat";

    const name$p = "firebase";
    const version$2 = "10.4.0";

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * The default app name
     *
     * @internal
     */
    const DEFAULT_ENTRY_NAME = '[DEFAULT]';
    const PLATFORM_LOG_STRING = {
        [name$o]: 'fire-core',
        [name$n]: 'fire-core-compat',
        [name$l]: 'fire-analytics',
        [name$m]: 'fire-analytics-compat',
        [name$j]: 'fire-app-check',
        [name$k]: 'fire-app-check-compat',
        [name$i]: 'fire-auth',
        [name$h]: 'fire-auth-compat',
        [name$g]: 'fire-rtdb',
        [name$f]: 'fire-rtdb-compat',
        [name$e]: 'fire-fn',
        [name$d]: 'fire-fn-compat',
        [name$c]: 'fire-iid',
        [name$b]: 'fire-iid-compat',
        [name$a]: 'fire-fcm',
        [name$9]: 'fire-fcm-compat',
        [name$8]: 'fire-perf',
        [name$7]: 'fire-perf-compat',
        [name$6]: 'fire-rc',
        [name$5]: 'fire-rc-compat',
        [name$4]: 'fire-gcs',
        [name$3]: 'fire-gcs-compat',
        [name$2]: 'fire-fst',
        [name$1$1]: 'fire-fst-compat',
        'fire-js': 'fire-js',
        [name$p]: 'fire-js-all'
    };

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @internal
     */
    const _apps = new Map();
    /**
     * Registered components.
     *
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _components = new Map();
    /**
     * @param component - the component being added to this app's container
     *
     * @internal
     */
    function _addComponent(app, component) {
        try {
            app.container.addComponent(component);
        }
        catch (e) {
            logger$1.debug(`Component ${component.name} failed to register with FirebaseApp ${app.name}`, e);
        }
    }
    /**
     *
     * @param component - the component to register
     * @returns whether or not the component is registered successfully
     *
     * @internal
     */
    function _registerComponent(component) {
        const componentName = component.name;
        if (_components.has(componentName)) {
            logger$1.debug(`There were multiple attempts to register component ${componentName}.`);
            return false;
        }
        _components.set(componentName, component);
        // add the component to existing app instances
        for (const app of _apps.values()) {
            _addComponent(app, component);
        }
        return true;
    }
    /**
     *
     * @param app - FirebaseApp instance
     * @param name - service name
     *
     * @returns the provider for the service with the matching name
     *
     * @internal
     */
    function _getProvider(app, name) {
        const heartbeatController = app.container
            .getProvider('heartbeat')
            .getImmediate({ optional: true });
        if (heartbeatController) {
            void heartbeatController.triggerHeartbeat();
        }
        return app.container.getProvider(name);
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const ERRORS = {
        ["no-app" /* AppError.NO_APP */]: "No Firebase App '{$appName}' has been created - " +
            'call initializeApp() first',
        ["bad-app-name" /* AppError.BAD_APP_NAME */]: "Illegal App name: '{$appName}",
        ["duplicate-app" /* AppError.DUPLICATE_APP */]: "Firebase App named '{$appName}' already exists with different options or config",
        ["app-deleted" /* AppError.APP_DELETED */]: "Firebase App named '{$appName}' already deleted",
        ["no-options" /* AppError.NO_OPTIONS */]: 'Need to provide options, when not being deployed to hosting via source.',
        ["invalid-app-argument" /* AppError.INVALID_APP_ARGUMENT */]: 'firebase.{$appName}() takes either no argument or a ' +
            'Firebase App instance.',
        ["invalid-log-argument" /* AppError.INVALID_LOG_ARGUMENT */]: 'First argument to `onLog` must be null or a function.',
        ["idb-open" /* AppError.IDB_OPEN */]: 'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-get" /* AppError.IDB_GET */]: 'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-set" /* AppError.IDB_WRITE */]: 'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
        ["idb-delete" /* AppError.IDB_DELETE */]: 'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.'
    };
    const ERROR_FACTORY = new ErrorFactory('app', 'Firebase', ERRORS);

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class FirebaseAppImpl {
        constructor(options, config, container) {
            this._isDeleted = false;
            this._options = Object.assign({}, options);
            this._config = Object.assign({}, config);
            this._name = config.name;
            this._automaticDataCollectionEnabled =
                config.automaticDataCollectionEnabled;
            this._container = container;
            this.container.addComponent(new Component('app', () => this, "PUBLIC" /* ComponentType.PUBLIC */));
        }
        get automaticDataCollectionEnabled() {
            this.checkDestroyed();
            return this._automaticDataCollectionEnabled;
        }
        set automaticDataCollectionEnabled(val) {
            this.checkDestroyed();
            this._automaticDataCollectionEnabled = val;
        }
        get name() {
            this.checkDestroyed();
            return this._name;
        }
        get options() {
            this.checkDestroyed();
            return this._options;
        }
        get config() {
            this.checkDestroyed();
            return this._config;
        }
        get container() {
            return this._container;
        }
        get isDeleted() {
            return this._isDeleted;
        }
        set isDeleted(val) {
            this._isDeleted = val;
        }
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */
        checkDestroyed() {
            if (this.isDeleted) {
                throw ERROR_FACTORY.create("app-deleted" /* AppError.APP_DELETED */, { appName: this._name });
            }
        }
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * The current SDK version.
     *
     * @public
     */
    const SDK_VERSION$1 = version$2;
    function initializeApp(_options, rawConfig = {}) {
        let options = _options;
        if (typeof rawConfig !== 'object') {
            const name = rawConfig;
            rawConfig = { name };
        }
        const config = Object.assign({ name: DEFAULT_ENTRY_NAME, automaticDataCollectionEnabled: false }, rawConfig);
        const name = config.name;
        if (typeof name !== 'string' || !name) {
            throw ERROR_FACTORY.create("bad-app-name" /* AppError.BAD_APP_NAME */, {
                appName: String(name)
            });
        }
        options || (options = getDefaultAppConfig());
        if (!options) {
            throw ERROR_FACTORY.create("no-options" /* AppError.NO_OPTIONS */);
        }
        const existingApp = _apps.get(name);
        if (existingApp) {
            // return the existing app if options and config deep equal the ones in the existing app.
            if (deepEqual(options, existingApp.options) &&
                deepEqual(config, existingApp.config)) {
                return existingApp;
            }
            else {
                throw ERROR_FACTORY.create("duplicate-app" /* AppError.DUPLICATE_APP */, { appName: name });
            }
        }
        const container = new ComponentContainer(name);
        for (const component of _components.values()) {
            container.addComponent(component);
        }
        const newApp = new FirebaseAppImpl(options, config, container);
        _apps.set(name, newApp);
        return newApp;
    }
    /**
     * Retrieves a {@link @firebase/app#FirebaseApp} instance.
     *
     * When called with no arguments, the default app is returned. When an app name
     * is provided, the app corresponding to that name is returned.
     *
     * An exception is thrown if the app being retrieved has not yet been
     * initialized.
     *
     * @example
     * ```javascript
     * // Return the default app
     * const app = getApp();
     * ```
     *
     * @example
     * ```javascript
     * // Return a named app
     * const otherApp = getApp("otherApp");
     * ```
     *
     * @param name - Optional name of the app to return. If no name is
     *   provided, the default is `"[DEFAULT]"`.
     *
     * @returns The app corresponding to the provided app name.
     *   If no app name is provided, the default app is returned.
     *
     * @public
     */
    function getApp(name = DEFAULT_ENTRY_NAME) {
        const app = _apps.get(name);
        if (!app && name === DEFAULT_ENTRY_NAME && getDefaultAppConfig()) {
            return initializeApp();
        }
        if (!app) {
            throw ERROR_FACTORY.create("no-app" /* AppError.NO_APP */, { appName: name });
        }
        return app;
    }
    /**
     * Registers a library's name and version for platform logging purposes.
     * @param library - Name of 1p or 3p library (e.g. firestore, angularfire)
     * @param version - Current version of that library.
     * @param variant - Bundle variant, e.g., node, rn, etc.
     *
     * @public
     */
    function registerVersion(libraryKeyOrName, version, variant) {
        var _a;
        // TODO: We can use this check to whitelist strings when/if we set up
        // a good whitelist system.
        let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
        if (variant) {
            library += `-${variant}`;
        }
        const libraryMismatch = library.match(/\s|\//);
        const versionMismatch = version.match(/\s|\//);
        if (libraryMismatch || versionMismatch) {
            const warning = [
                `Unable to register library "${library}" with version "${version}":`
            ];
            if (libraryMismatch) {
                warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
            }
            if (libraryMismatch && versionMismatch) {
                warning.push('and');
            }
            if (versionMismatch) {
                warning.push(`version name "${version}" contains illegal characters (whitespace or "/")`);
            }
            logger$1.warn(warning.join(' '));
            return;
        }
        _registerComponent(new Component(`${library}-version`, () => ({ library, version }), "VERSION" /* ComponentType.VERSION */));
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const DB_NAME = 'firebase-heartbeat-database';
    const DB_VERSION = 1;
    const STORE_NAME = 'firebase-heartbeat-store';
    let dbPromise = null;
    function getDbPromise() {
        if (!dbPromise) {
            dbPromise = openDB(DB_NAME, DB_VERSION, {
                upgrade: (db, oldVersion) => {
                    // We don't use 'break' in this switch statement, the fall-through
                    // behavior is what we want, because if there are multiple versions between
                    // the old version and the current version, we want ALL the migrations
                    // that correspond to those versions to run, not only the last one.
                    // eslint-disable-next-line default-case
                    switch (oldVersion) {
                        case 0:
                            db.createObjectStore(STORE_NAME);
                    }
                }
            }).catch(e => {
                throw ERROR_FACTORY.create("idb-open" /* AppError.IDB_OPEN */, {
                    originalErrorMessage: e.message
                });
            });
        }
        return dbPromise;
    }
    async function readHeartbeatsFromIndexedDB(app) {
        try {
            const db = await getDbPromise();
            const result = await db
                .transaction(STORE_NAME)
                .objectStore(STORE_NAME)
                .get(computeKey(app));
            return result;
        }
        catch (e) {
            if (e instanceof FirebaseError) {
                logger$1.warn(e.message);
            }
            else {
                const idbGetError = ERROR_FACTORY.create("idb-get" /* AppError.IDB_GET */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                });
                logger$1.warn(idbGetError.message);
            }
        }
    }
    async function writeHeartbeatsToIndexedDB(app, heartbeatObject) {
        try {
            const db = await getDbPromise();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const objectStore = tx.objectStore(STORE_NAME);
            await objectStore.put(heartbeatObject, computeKey(app));
            await tx.done;
        }
        catch (e) {
            if (e instanceof FirebaseError) {
                logger$1.warn(e.message);
            }
            else {
                const idbGetError = ERROR_FACTORY.create("idb-set" /* AppError.IDB_WRITE */, {
                    originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
                });
                logger$1.warn(idbGetError.message);
            }
        }
    }
    function computeKey(app) {
        return `${app.name}!${app.options.appId}`;
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const MAX_HEADER_BYTES = 1024;
    // 30 days
    const STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1000;
    class HeartbeatServiceImpl {
        constructor(container) {
            this.container = container;
            /**
             * In-memory cache for heartbeats, used by getHeartbeatsHeader() to generate
             * the header string.
             * Stores one record per date. This will be consolidated into the standard
             * format of one record per user agent string before being sent as a header.
             * Populated from indexedDB when the controller is instantiated and should
             * be kept in sync with indexedDB.
             * Leave public for easier testing.
             */
            this._heartbeatsCache = null;
            const app = this.container.getProvider('app').getImmediate();
            this._storage = new HeartbeatStorageImpl(app);
            this._heartbeatsCachePromise = this._storage.read().then(result => {
                this._heartbeatsCache = result;
                return result;
            });
        }
        /**
         * Called to report a heartbeat. The function will generate
         * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
         * to IndexedDB.
         * Note that we only store one heartbeat per day. So if a heartbeat for today is
         * already logged, subsequent calls to this function in the same day will be ignored.
         */
        async triggerHeartbeat() {
            const platformLogger = this.container
                .getProvider('platform-logger')
                .getImmediate();
            // This is the "Firebase user agent" string from the platform logger
            // service, not the browser user agent.
            const agent = platformLogger.getPlatformInfoString();
            const date = getUTCDateString();
            if (this._heartbeatsCache === null) {
                this._heartbeatsCache = await this._heartbeatsCachePromise;
            }
            // Do not store a heartbeat if one is already stored for this day
            // or if a header has already been sent today.
            if (this._heartbeatsCache.lastSentHeartbeatDate === date ||
                this._heartbeatsCache.heartbeats.some(singleDateHeartbeat => singleDateHeartbeat.date === date)) {
                return;
            }
            else {
                // There is no entry for this date. Create one.
                this._heartbeatsCache.heartbeats.push({ date, agent });
            }
            // Remove entries older than 30 days.
            this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter(singleDateHeartbeat => {
                const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
                const now = Date.now();
                return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
            });
            return this._storage.overwrite(this._heartbeatsCache);
        }
        /**
         * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
         * It also clears all heartbeats from memory as well as in IndexedDB.
         *
         * NOTE: Consuming product SDKs should not send the header if this method
         * returns an empty string.
         */
        async getHeartbeatsHeader() {
            if (this._heartbeatsCache === null) {
                await this._heartbeatsCachePromise;
            }
            // If it's still null or the array is empty, there is no data to send.
            if (this._heartbeatsCache === null ||
                this._heartbeatsCache.heartbeats.length === 0) {
                return '';
            }
            const date = getUTCDateString();
            // Extract as many heartbeats from the cache as will fit under the size limit.
            const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
            const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
            // Store last sent date to prevent another being logged/sent for the same day.
            this._heartbeatsCache.lastSentHeartbeatDate = date;
            if (unsentEntries.length > 0) {
                // Store any unsent entries if they exist.
                this._heartbeatsCache.heartbeats = unsentEntries;
                // This seems more likely than emptying the array (below) to lead to some odd state
                // since the cache isn't empty and this will be called again on the next request,
                // and is probably safest if we await it.
                await this._storage.overwrite(this._heartbeatsCache);
            }
            else {
                this._heartbeatsCache.heartbeats = [];
                // Do not wait for this, to reduce latency.
                void this._storage.overwrite(this._heartbeatsCache);
            }
            return headerString;
        }
    }
    function getUTCDateString() {
        const today = new Date();
        // Returns date format 'YYYY-MM-DD'
        return today.toISOString().substring(0, 10);
    }
    function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
        // Heartbeats grouped by user agent in the standard format to be sent in
        // the header.
        const heartbeatsToSend = [];
        // Single date format heartbeats that are not sent.
        let unsentEntries = heartbeatsCache.slice();
        for (const singleDateHeartbeat of heartbeatsCache) {
            // Look for an existing entry with the same user agent.
            const heartbeatEntry = heartbeatsToSend.find(hb => hb.agent === singleDateHeartbeat.agent);
            if (!heartbeatEntry) {
                // If no entry for this user agent exists, create one.
                heartbeatsToSend.push({
                    agent: singleDateHeartbeat.agent,
                    dates: [singleDateHeartbeat.date]
                });
                if (countBytes(heartbeatsToSend) > maxSize) {
                    // If the header would exceed max size, remove the added heartbeat
                    // entry and stop adding to the header.
                    heartbeatsToSend.pop();
                    break;
                }
            }
            else {
                heartbeatEntry.dates.push(singleDateHeartbeat.date);
                // If the header would exceed max size, remove the added date
                // and stop adding to the header.
                if (countBytes(heartbeatsToSend) > maxSize) {
                    heartbeatEntry.dates.pop();
                    break;
                }
            }
            // Pop unsent entry from queue. (Skipped if adding the entry exceeded
            // quota and the loop breaks early.)
            unsentEntries = unsentEntries.slice(1);
        }
        return {
            heartbeatsToSend,
            unsentEntries
        };
    }
    class HeartbeatStorageImpl {
        constructor(app) {
            this.app = app;
            this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
        }
        async runIndexedDBEnvironmentCheck() {
            if (!isIndexedDBAvailable()) {
                return false;
            }
            else {
                return validateIndexedDBOpenable()
                    .then(() => true)
                    .catch(() => false);
            }
        }
        /**
         * Read all heartbeats.
         */
        async read() {
            const canUseIndexedDB = await this._canUseIndexedDBPromise;
            if (!canUseIndexedDB) {
                return { heartbeats: [] };
            }
            else {
                const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
                return idbHeartbeatObject || { heartbeats: [] };
            }
        }
        // overwrite the storage with the provided heartbeats
        async overwrite(heartbeatsObject) {
            var _a;
            const canUseIndexedDB = await this._canUseIndexedDBPromise;
            if (!canUseIndexedDB) {
                return;
            }
            else {
                const existingHeartbeatsObject = await this.read();
                return writeHeartbeatsToIndexedDB(this.app, {
                    lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                    heartbeats: heartbeatsObject.heartbeats
                });
            }
        }
        // add heartbeats
        async add(heartbeatsObject) {
            var _a;
            const canUseIndexedDB = await this._canUseIndexedDBPromise;
            if (!canUseIndexedDB) {
                return;
            }
            else {
                const existingHeartbeatsObject = await this.read();
                return writeHeartbeatsToIndexedDB(this.app, {
                    lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
                    heartbeats: [
                        ...existingHeartbeatsObject.heartbeats,
                        ...heartbeatsObject.heartbeats
                    ]
                });
            }
        }
    }
    /**
     * Calculate bytes of a HeartbeatsByUserAgent array after being wrapped
     * in a platform logging header JSON object, stringified, and converted
     * to base 64.
     */
    function countBytes(heartbeatsCache) {
        // base64 has a restricted set of characters, all of which should be 1 byte.
        return base64urlEncodeWithoutPadding(
        // heartbeatsCache wrapper properties
        JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function registerCoreComponents(variant) {
        _registerComponent(new Component('platform-logger', container => new PlatformLoggerServiceImpl(container), "PRIVATE" /* ComponentType.PRIVATE */));
        _registerComponent(new Component('heartbeat', container => new HeartbeatServiceImpl(container), "PRIVATE" /* ComponentType.PRIVATE */));
        // Register `app` package.
        registerVersion(name$o, version$1$1, variant);
        // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
        registerVersion(name$o, version$1$1, 'esm2017');
        // Register platform SDK identifier (no version).
        registerVersion('fire-js', '');
    }

    /**
     * Firebase App
     *
     * @remarks This package coordinates the communication between the different Firebase components
     * @packageDocumentation
     */
    registerCoreComponents('');

    var name$1 = "firebase";
    var version$1 = "10.4.0";

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    registerVersion(name$1, version$1, 'app');

    const name = "@firebase/database";
    const version = "1.0.1";

    /**
     * @license
     * Copyright 2019 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /** The semver (www.semver.org) version of the SDK. */
    let SDK_VERSION = '';
    /**
     * SDK_VERSION should be set before any database instance is created
     * @internal
     */
    function setSDKVersion(version) {
        SDK_VERSION = version;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Wraps a DOM Storage object and:
     * - automatically encode objects as JSON strings before storing them to allow us to store arbitrary types.
     * - prefixes names with "firebase:" to avoid collisions with app data.
     *
     * We automatically (see storage.js) create two such wrappers, one for sessionStorage,
     * and one for localStorage.
     *
     */
    class DOMStorageWrapper {
        /**
         * @param domStorage_ - The underlying storage object (e.g. localStorage or sessionStorage)
         */
        constructor(domStorage_) {
            this.domStorage_ = domStorage_;
            // Use a prefix to avoid collisions with other stuff saved by the app.
            this.prefix_ = 'firebase:';
        }
        /**
         * @param key - The key to save the value under
         * @param value - The value being stored, or null to remove the key.
         */
        set(key, value) {
            if (value == null) {
                this.domStorage_.removeItem(this.prefixedName_(key));
            }
            else {
                this.domStorage_.setItem(this.prefixedName_(key), stringify(value));
            }
        }
        /**
         * @returns The value that was stored under this key, or null
         */
        get(key) {
            const storedVal = this.domStorage_.getItem(this.prefixedName_(key));
            if (storedVal == null) {
                return null;
            }
            else {
                return jsonEval(storedVal);
            }
        }
        remove(key) {
            this.domStorage_.removeItem(this.prefixedName_(key));
        }
        prefixedName_(name) {
            return this.prefix_ + name;
        }
        toString() {
            return this.domStorage_.toString();
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * An in-memory storage implementation that matches the API of DOMStorageWrapper
     * (TODO: create interface for both to implement).
     */
    class MemoryStorage {
        constructor() {
            this.cache_ = {};
            this.isInMemoryStorage = true;
        }
        set(key, value) {
            if (value == null) {
                delete this.cache_[key];
            }
            else {
                this.cache_[key] = value;
            }
        }
        get(key) {
            if (contains(this.cache_, key)) {
                return this.cache_[key];
            }
            return null;
        }
        remove(key) {
            delete this.cache_[key];
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Helper to create a DOMStorageWrapper or else fall back to MemoryStorage.
     * TODO: Once MemoryStorage and DOMStorageWrapper have a shared interface this method annotation should change
     * to reflect this type
     *
     * @param domStorageName - Name of the underlying storage object
     *   (e.g. 'localStorage' or 'sessionStorage').
     * @returns Turning off type information until a common interface is defined.
     */
    const createStoragefor = function (domStorageName) {
        try {
            // NOTE: just accessing "localStorage" or "window['localStorage']" may throw a security exception,
            // so it must be inside the try/catch.
            if (typeof window !== 'undefined' &&
                typeof window[domStorageName] !== 'undefined') {
                // Need to test cache. Just because it's here doesn't mean it works
                const domStorage = window[domStorageName];
                domStorage.setItem('firebase:sentinel', 'cache');
                domStorage.removeItem('firebase:sentinel');
                return new DOMStorageWrapper(domStorage);
            }
        }
        catch (e) { }
        // Failed to create wrapper.  Just return in-memory storage.
        // TODO: log?
        return new MemoryStorage();
    };
    /** A storage object that lasts across sessions */
    const PersistentStorage = createStoragefor('localStorage');
    /** A storage object that only lasts one session */
    const SessionStorage = createStoragefor('sessionStorage');

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const logClient = new Logger('@firebase/database');
    /**
     * Returns a locally-unique ID (generated by just incrementing up from 0 each time its called).
     */
    const LUIDGenerator = (function () {
        let id = 1;
        return function () {
            return id++;
        };
    })();
    /**
     * Sha1 hash of the input string
     * @param str - The string to hash
     * @returns {!string} The resulting hash
     */
    const sha1 = function (str) {
        const utf8Bytes = stringToByteArray(str);
        const sha1 = new Sha1();
        sha1.update(utf8Bytes);
        const sha1Bytes = sha1.digest();
        return base64.encodeByteArray(sha1Bytes);
    };
    const buildLogMessage_ = function (...varArgs) {
        let message = '';
        for (let i = 0; i < varArgs.length; i++) {
            const arg = varArgs[i];
            if (Array.isArray(arg) ||
                (arg &&
                    typeof arg === 'object' &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    typeof arg.length === 'number')) {
                message += buildLogMessage_.apply(null, arg);
            }
            else if (typeof arg === 'object') {
                message += stringify(arg);
            }
            else {
                message += arg;
            }
            message += ' ';
        }
        return message;
    };
    /**
     * Use this for all debug messages in Firebase.
     */
    let logger = null;
    /**
     * Flag to check for log availability on first log message
     */
    let firstLog_ = true;
    /**
     * The implementation of Firebase.enableLogging (defined here to break dependencies)
     * @param logger_ - A flag to turn on logging, or a custom logger
     * @param persistent - Whether or not to persist logging settings across refreshes
     */
    const enableLogging$1 = function (logger_, persistent) {
        assert(!persistent || logger_ === true || logger_ === false, "Can't turn on custom loggers persistently.");
        if (logger_ === true) {
            logClient.logLevel = LogLevel.VERBOSE;
            logger = logClient.log.bind(logClient);
            if (persistent) {
                SessionStorage.set('logging_enabled', true);
            }
        }
        else if (typeof logger_ === 'function') {
            logger = logger_;
        }
        else {
            logger = null;
            SessionStorage.remove('logging_enabled');
        }
    };
    const log = function (...varArgs) {
        if (firstLog_ === true) {
            firstLog_ = false;
            if (logger === null && SessionStorage.get('logging_enabled') === true) {
                enableLogging$1(true);
            }
        }
        if (logger) {
            const message = buildLogMessage_.apply(null, varArgs);
            logger(message);
        }
    };
    const logWrapper = function (prefix) {
        return function (...varArgs) {
            log(prefix, ...varArgs);
        };
    };
    const error = function (...varArgs) {
        const message = 'FIREBASE INTERNAL ERROR: ' + buildLogMessage_(...varArgs);
        logClient.error(message);
    };
    const fatal = function (...varArgs) {
        const message = `FIREBASE FATAL ERROR: ${buildLogMessage_(...varArgs)}`;
        logClient.error(message);
        throw new Error(message);
    };
    const warn = function (...varArgs) {
        const message = 'FIREBASE WARNING: ' + buildLogMessage_(...varArgs);
        logClient.warn(message);
    };
    /**
     * Logs a warning if the containing page uses https. Called when a call to new Firebase
     * does not use https.
     */
    const warnIfPageIsSecure = function () {
        // Be very careful accessing browser globals. Who knows what may or may not exist.
        if (typeof window !== 'undefined' &&
            window.location &&
            window.location.protocol &&
            window.location.protocol.indexOf('https:') !== -1) {
            warn('Insecure Firebase access from a secure page. ' +
                'Please use https in calls to new Firebase().');
        }
    };
    /**
     * Returns true if data is NaN, or +/- Infinity.
     */
    const isInvalidJSONNumber = function (data) {
        return (typeof data === 'number' &&
            (data !== data || // NaN
                data === Number.POSITIVE_INFINITY ||
                data === Number.NEGATIVE_INFINITY));
    };
    const executeWhenDOMReady = function (fn) {
        if (document.readyState === 'complete') {
            fn();
        }
        else {
            // Modeled after jQuery. Try DOMContentLoaded and onreadystatechange (which
            // fire before onload), but fall back to onload.
            let called = false;
            const wrappedFn = function () {
                if (!document.body) {
                    setTimeout(wrappedFn, Math.floor(10));
                    return;
                }
                if (!called) {
                    called = true;
                    fn();
                }
            };
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', wrappedFn, false);
                // fallback to onload.
                window.addEventListener('load', wrappedFn, false);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            else if (document.attachEvent) {
                // IE.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                document.attachEvent('onreadystatechange', () => {
                    if (document.readyState === 'complete') {
                        wrappedFn();
                    }
                });
                // fallback to onload.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                window.attachEvent('onload', wrappedFn);
                // jQuery has an extra hack for IE that we could employ (based on
                // http://javascript.nwbox.com/IEContentLoaded/) But it looks really old.
                // I'm hoping we don't need it.
            }
        }
    };
    /**
     * Minimum key name. Invalid for actual data, used as a marker to sort before any valid names
     */
    const MIN_NAME = '[MIN_NAME]';
    /**
     * Maximum key name. Invalid for actual data, used as a marker to sort above any valid names
     */
    const MAX_NAME = '[MAX_NAME]';
    /**
     * Compares valid Firebase key names, plus min and max name
     */
    const nameCompare = function (a, b) {
        if (a === b) {
            return 0;
        }
        else if (a === MIN_NAME || b === MAX_NAME) {
            return -1;
        }
        else if (b === MIN_NAME || a === MAX_NAME) {
            return 1;
        }
        else {
            const aAsInt = tryParseInt(a), bAsInt = tryParseInt(b);
            if (aAsInt !== null) {
                if (bAsInt !== null) {
                    return aAsInt - bAsInt === 0 ? a.length - b.length : aAsInt - bAsInt;
                }
                else {
                    return -1;
                }
            }
            else if (bAsInt !== null) {
                return 1;
            }
            else {
                return a < b ? -1 : 1;
            }
        }
    };
    /**
     * @returns {!number} comparison result.
     */
    const stringCompare = function (a, b) {
        if (a === b) {
            return 0;
        }
        else if (a < b) {
            return -1;
        }
        else {
            return 1;
        }
    };
    const requireKey = function (key, obj) {
        if (obj && key in obj) {
            return obj[key];
        }
        else {
            throw new Error('Missing required key (' + key + ') in object: ' + stringify(obj));
        }
    };
    const ObjectToUniqueKey = function (obj) {
        if (typeof obj !== 'object' || obj === null) {
            return stringify(obj);
        }
        const keys = [];
        // eslint-disable-next-line guard-for-in
        for (const k in obj) {
            keys.push(k);
        }
        // Export as json, but with the keys sorted.
        keys.sort();
        let key = '{';
        for (let i = 0; i < keys.length; i++) {
            if (i !== 0) {
                key += ',';
            }
            key += stringify(keys[i]);
            key += ':';
            key += ObjectToUniqueKey(obj[keys[i]]);
        }
        key += '}';
        return key;
    };
    /**
     * Splits a string into a number of smaller segments of maximum size
     * @param str - The string
     * @param segsize - The maximum number of chars in the string.
     * @returns The string, split into appropriately-sized chunks
     */
    const splitStringBySize = function (str, segsize) {
        const len = str.length;
        if (len <= segsize) {
            return [str];
        }
        const dataSegs = [];
        for (let c = 0; c < len; c += segsize) {
            if (c + segsize > len) {
                dataSegs.push(str.substring(c, len));
            }
            else {
                dataSegs.push(str.substring(c, c + segsize));
            }
        }
        return dataSegs;
    };
    /**
     * Apply a function to each (key, value) pair in an object or
     * apply a function to each (index, value) pair in an array
     * @param obj - The object or array to iterate over
     * @param fn - The function to apply
     */
    function each(obj, fn) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                fn(key, obj[key]);
            }
        }
    }
    /**
     * Borrowed from http://hg.secondlife.com/llsd/src/tip/js/typedarray.js (MIT License)
     * I made one modification at the end and removed the NaN / Infinity
     * handling (since it seemed broken [caused an overflow] and we don't need it).  See MJL comments.
     * @param v - A double
     *
     */
    const doubleToIEEE754String = function (v) {
        assert(!isInvalidJSONNumber(v), 'Invalid JSON number'); // MJL
        const ebits = 11, fbits = 52;
        const bias = (1 << (ebits - 1)) - 1;
        let s, e, f, ln, i;
        // Compute sign, exponent, fraction
        // Skip NaN / Infinity handling --MJL.
        if (v === 0) {
            e = 0;
            f = 0;
            s = 1 / v === -Infinity ? 1 : 0;
        }
        else {
            s = v < 0;
            v = Math.abs(v);
            if (v >= Math.pow(2, 1 - bias)) {
                // Normalized
                ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
                e = ln + bias;
                f = Math.round(v * Math.pow(2, fbits - ln) - Math.pow(2, fbits));
            }
            else {
                // Denormalized
                e = 0;
                f = Math.round(v / Math.pow(2, 1 - bias - fbits));
            }
        }
        // Pack sign, exponent, fraction
        const bits = [];
        for (i = fbits; i; i -= 1) {
            bits.push(f % 2 ? 1 : 0);
            f = Math.floor(f / 2);
        }
        for (i = ebits; i; i -= 1) {
            bits.push(e % 2 ? 1 : 0);
            e = Math.floor(e / 2);
        }
        bits.push(s ? 1 : 0);
        bits.reverse();
        const str = bits.join('');
        // Return the data as a hex string. --MJL
        let hexByteString = '';
        for (i = 0; i < 64; i += 8) {
            let hexByte = parseInt(str.substr(i, 8), 2).toString(16);
            if (hexByte.length === 1) {
                hexByte = '0' + hexByte;
            }
            hexByteString = hexByteString + hexByte;
        }
        return hexByteString.toLowerCase();
    };
    /**
     * Used to detect if we're in a Chrome content script (which executes in an
     * isolated environment where long-polling doesn't work).
     */
    const isChromeExtensionContentScript = function () {
        return !!(typeof window === 'object' &&
            window['chrome'] &&
            window['chrome']['extension'] &&
            !/^chrome/.test(window.location.href));
    };
    /**
     * Used to detect if we're in a Windows 8 Store app.
     */
    const isWindowsStoreApp = function () {
        // Check for the presence of a couple WinRT globals
        return typeof Windows === 'object' && typeof Windows.UI === 'object';
    };
    /**
     * Used to test for integer-looking strings
     */
    const INTEGER_REGEXP_ = new RegExp('^-?(0*)\\d{1,10}$');
    /**
     * For use in keys, the minimum possible 32-bit integer.
     */
    const INTEGER_32_MIN = -2147483648;
    /**
     * For use in kyes, the maximum possible 32-bit integer.
     */
    const INTEGER_32_MAX = 2147483647;
    /**
     * If the string contains a 32-bit integer, return it.  Else return null.
     */
    const tryParseInt = function (str) {
        if (INTEGER_REGEXP_.test(str)) {
            const intVal = Number(str);
            if (intVal >= INTEGER_32_MIN && intVal <= INTEGER_32_MAX) {
                return intVal;
            }
        }
        return null;
    };
    /**
     * Helper to run some code but catch any exceptions and re-throw them later.
     * Useful for preventing user callbacks from breaking internal code.
     *
     * Re-throwing the exception from a setTimeout is a little evil, but it's very
     * convenient (we don't have to try to figure out when is a safe point to
     * re-throw it), and the behavior seems reasonable:
     *
     * * If you aren't pausing on exceptions, you get an error in the console with
     *   the correct stack trace.
     * * If you're pausing on all exceptions, the debugger will pause on your
     *   exception and then again when we rethrow it.
     * * If you're only pausing on uncaught exceptions, the debugger will only pause
     *   on us re-throwing it.
     *
     * @param fn - The code to guard.
     */
    const exceptionGuard = function (fn) {
        try {
            fn();
        }
        catch (e) {
            // Re-throw exception when it's safe.
            setTimeout(() => {
                // It used to be that "throw e" would result in a good console error with
                // relevant context, but as of Chrome 39, you just get the firebase.js
                // file/line number where we re-throw it, which is useless. So we log
                // e.stack explicitly.
                const stack = e.stack || '';
                warn('Exception was thrown by user callback.', stack);
                throw e;
            }, Math.floor(0));
        }
    };
    /**
     * @returns {boolean} true if we think we're currently being crawled.
     */
    const beingCrawled = function () {
        const userAgent = (typeof window === 'object' &&
            window['navigator'] &&
            window['navigator']['userAgent']) ||
            '';
        // For now we whitelist the most popular crawlers.  We should refine this to be the set of crawlers we
        // believe to support JavaScript/AJAX rendering.
        // NOTE: Google Webmaster Tools doesn't really belong, but their "This is how a visitor to your website
        // would have seen the page" is flaky if we don't treat it as a crawler.
        return (userAgent.search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i) >= 0);
    };
    /**
     * Same as setTimeout() except on Node.JS it will /not/ prevent the process from exiting.
     *
     * It is removed with clearTimeout() as normal.
     *
     * @param fn - Function to run.
     * @param time - Milliseconds to wait before running.
     * @returns The setTimeout() return value.
     */
    const setTimeoutNonBlocking = function (fn, time) {
        const timeout = setTimeout(fn, time);
        // Note: at the time of this comment, unrefTimer is under the unstable set of APIs. Run with --unstable to enable the API.
        if (typeof timeout === 'number' &&
            // @ts-ignore Is only defined in Deno environments.
            typeof Deno !== 'undefined' &&
            // @ts-ignore Deno and unrefTimer are only defined in Deno environments.
            Deno['unrefTimer']) {
            // @ts-ignore Deno and unrefTimer are only defined in Deno environments.
            Deno.unrefTimer(timeout);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        else if (typeof timeout === 'object' && timeout['unref']) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            timeout['unref']();
        }
        return timeout;
    };

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Abstraction around AppCheck's token fetching capabilities.
     */
    class AppCheckTokenProvider {
        constructor(appName_, appCheckProvider) {
            this.appName_ = appName_;
            this.appCheckProvider = appCheckProvider;
            this.appCheck = appCheckProvider === null || appCheckProvider === void 0 ? void 0 : appCheckProvider.getImmediate({ optional: true });
            if (!this.appCheck) {
                appCheckProvider === null || appCheckProvider === void 0 ? void 0 : appCheckProvider.get().then(appCheck => (this.appCheck = appCheck));
            }
        }
        getToken(forceRefresh) {
            if (!this.appCheck) {
                return new Promise((resolve, reject) => {
                    // Support delayed initialization of FirebaseAppCheck. This allows our
                    // customers to initialize the RTDB SDK before initializing Firebase
                    // AppCheck and ensures that all requests are authenticated if a token
                    // becomes available before the timoeout below expires.
                    setTimeout(() => {
                        if (this.appCheck) {
                            this.getToken(forceRefresh).then(resolve, reject);
                        }
                        else {
                            resolve(null);
                        }
                    }, 0);
                });
            }
            return this.appCheck.getToken(forceRefresh);
        }
        addTokenChangeListener(listener) {
            var _a;
            (_a = this.appCheckProvider) === null || _a === void 0 ? void 0 : _a.get().then(appCheck => appCheck.addTokenListener(listener));
        }
        notifyForInvalidToken() {
            warn(`Provided AppCheck credentials for the app named "${this.appName_}" ` +
                'are invalid. This usually indicates your app was not initialized correctly.');
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Abstraction around FirebaseApp's token fetching capabilities.
     */
    class FirebaseAuthTokenProvider {
        constructor(appName_, firebaseOptions_, authProvider_) {
            this.appName_ = appName_;
            this.firebaseOptions_ = firebaseOptions_;
            this.authProvider_ = authProvider_;
            this.auth_ = null;
            this.auth_ = authProvider_.getImmediate({ optional: true });
            if (!this.auth_) {
                authProvider_.onInit(auth => (this.auth_ = auth));
            }
        }
        getToken(forceRefresh) {
            if (!this.auth_) {
                return new Promise((resolve, reject) => {
                    // Support delayed initialization of FirebaseAuth. This allows our
                    // customers to initialize the RTDB SDK before initializing Firebase
                    // Auth and ensures that all requests are authenticated if a token
                    // becomes available before the timoeout below expires.
                    setTimeout(() => {
                        if (this.auth_) {
                            this.getToken(forceRefresh).then(resolve, reject);
                        }
                        else {
                            resolve(null);
                        }
                    }, 0);
                });
            }
            return this.auth_.getToken(forceRefresh).catch(error => {
                // TODO: Need to figure out all the cases this is raised and whether
                // this makes sense.
                if (error && error.code === 'auth/token-not-initialized') {
                    log('Got auth/token-not-initialized error.  Treating as null token.');
                    return null;
                }
                else {
                    return Promise.reject(error);
                }
            });
        }
        addTokenChangeListener(listener) {
            // TODO: We might want to wrap the listener and call it with no args to
            // avoid a leaky abstraction, but that makes removing the listener harder.
            if (this.auth_) {
                this.auth_.addAuthTokenListener(listener);
            }
            else {
                this.authProvider_
                    .get()
                    .then(auth => auth.addAuthTokenListener(listener));
            }
        }
        removeTokenChangeListener(listener) {
            this.authProvider_
                .get()
                .then(auth => auth.removeAuthTokenListener(listener));
        }
        notifyForInvalidToken() {
            let errorMessage = 'Provided authentication credentials for the app named "' +
                this.appName_ +
                '" are invalid. This usually indicates your app was not ' +
                'initialized correctly. ';
            if ('credential' in this.firebaseOptions_) {
                errorMessage +=
                    'Make sure the "credential" property provided to initializeApp() ' +
                        'is authorized to access the specified "databaseURL" and is from the correct ' +
                        'project.';
            }
            else if ('serviceAccount' in this.firebaseOptions_) {
                errorMessage +=
                    'Make sure the "serviceAccount" property provided to initializeApp() ' +
                        'is authorized to access the specified "databaseURL" and is from the correct ' +
                        'project.';
            }
            else {
                errorMessage +=
                    'Make sure the "apiKey" and "databaseURL" properties provided to ' +
                        'initializeApp() match the values provided for your app at ' +
                        'https://console.firebase.google.com/.';
            }
            warn(errorMessage);
        }
    }
    /* AuthTokenProvider that supplies a constant token. Used by Admin SDK or mockUserToken with emulators. */
    class EmulatorTokenProvider {
        constructor(accessToken) {
            this.accessToken = accessToken;
        }
        getToken(forceRefresh) {
            return Promise.resolve({
                accessToken: this.accessToken
            });
        }
        addTokenChangeListener(listener) {
            // Invoke the listener immediately to match the behavior in Firebase Auth
            // (see packages/auth/src/auth.js#L1807)
            listener(this.accessToken);
        }
        removeTokenChangeListener(listener) { }
        notifyForInvalidToken() { }
    }
    /** A string that is treated as an admin access token by the RTDB emulator. Used by Admin SDK. */
    EmulatorTokenProvider.OWNER = 'owner';

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const PROTOCOL_VERSION = '5';
    const VERSION_PARAM = 'v';
    const TRANSPORT_SESSION_PARAM = 's';
    const REFERER_PARAM = 'r';
    const FORGE_REF = 'f';
    // Matches console.firebase.google.com, firebase-console-*.corp.google.com and
    // firebase.corp.google.com
    const FORGE_DOMAIN_RE = /(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/;
    const LAST_SESSION_PARAM = 'ls';
    const APPLICATION_ID_PARAM = 'p';
    const APP_CHECK_TOKEN_PARAM = 'ac';
    const WEBSOCKET = 'websocket';
    const LONG_POLLING = 'long_polling';

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * A class that holds metadata about a Repo object
     */
    class RepoInfo {
        /**
         * @param host - Hostname portion of the url for the repo
         * @param secure - Whether or not this repo is accessed over ssl
         * @param namespace - The namespace represented by the repo
         * @param webSocketOnly - Whether to prefer websockets over all other transports (used by Nest).
         * @param nodeAdmin - Whether this instance uses Admin SDK credentials
         * @param persistenceKey - Override the default session persistence storage key
         */
        constructor(host, secure, namespace, webSocketOnly, nodeAdmin = false, persistenceKey = '', includeNamespaceInQueryParams = false, isUsingEmulator = false) {
            this.secure = secure;
            this.namespace = namespace;
            this.webSocketOnly = webSocketOnly;
            this.nodeAdmin = nodeAdmin;
            this.persistenceKey = persistenceKey;
            this.includeNamespaceInQueryParams = includeNamespaceInQueryParams;
            this.isUsingEmulator = isUsingEmulator;
            this._host = host.toLowerCase();
            this._domain = this._host.substr(this._host.indexOf('.') + 1);
            this.internalHost =
                PersistentStorage.get('host:' + host) || this._host;
        }
        isCacheableHost() {
            return this.internalHost.substr(0, 2) === 's-';
        }
        isCustomHost() {
            return (this._domain !== 'firebaseio.com' &&
                this._domain !== 'firebaseio-demo.com');
        }
        get host() {
            return this._host;
        }
        set host(newHost) {
            if (newHost !== this.internalHost) {
                this.internalHost = newHost;
                if (this.isCacheableHost()) {
                    PersistentStorage.set('host:' + this._host, this.internalHost);
                }
            }
        }
        toString() {
            let str = this.toURLString();
            if (this.persistenceKey) {
                str += '<' + this.persistenceKey + '>';
            }
            return str;
        }
        toURLString() {
            const protocol = this.secure ? 'https://' : 'http://';
            const query = this.includeNamespaceInQueryParams
                ? `?ns=${this.namespace}`
                : '';
            return `${protocol}${this.host}/${query}`;
        }
    }
    function repoInfoNeedsQueryParam(repoInfo) {
        return (repoInfo.host !== repoInfo.internalHost ||
            repoInfo.isCustomHost() ||
            repoInfo.includeNamespaceInQueryParams);
    }
    /**
     * Returns the websocket URL for this repo
     * @param repoInfo - RepoInfo object
     * @param type - of connection
     * @param params - list
     * @returns The URL for this repo
     */
    function repoInfoConnectionURL(repoInfo, type, params) {
        assert(typeof type === 'string', 'typeof type must == string');
        assert(typeof params === 'object', 'typeof params must == object');
        let connURL;
        if (type === WEBSOCKET) {
            connURL =
                (repoInfo.secure ? 'wss://' : 'ws://') + repoInfo.internalHost + '/.ws?';
        }
        else if (type === LONG_POLLING) {
            connURL =
                (repoInfo.secure ? 'https://' : 'http://') +
                    repoInfo.internalHost +
                    '/.lp?';
        }
        else {
            throw new Error('Unknown connection type: ' + type);
        }
        if (repoInfoNeedsQueryParam(repoInfo)) {
            params['ns'] = repoInfo.namespace;
        }
        const pairs = [];
        each(params, (key, value) => {
            pairs.push(key + '=' + value);
        });
        return connURL + pairs.join('&');
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Tracks a collection of stats.
     */
    class StatsCollection {
        constructor() {
            this.counters_ = {};
        }
        incrementCounter(name, amount = 1) {
            if (!contains(this.counters_, name)) {
                this.counters_[name] = 0;
            }
            this.counters_[name] += amount;
        }
        get() {
            return deepCopy(this.counters_);
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const collections = {};
    const reporters = {};
    function statsManagerGetCollection(repoInfo) {
        const hashString = repoInfo.toString();
        if (!collections[hashString]) {
            collections[hashString] = new StatsCollection();
        }
        return collections[hashString];
    }
    function statsManagerGetOrCreateReporter(repoInfo, creatorFunction) {
        const hashString = repoInfo.toString();
        if (!reporters[hashString]) {
            reporters[hashString] = creatorFunction();
        }
        return reporters[hashString];
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * This class ensures the packets from the server arrive in order
     * This class takes data from the server and ensures it gets passed into the callbacks in order.
     */
    class PacketReceiver {
        /**
         * @param onMessage_
         */
        constructor(onMessage_) {
            this.onMessage_ = onMessage_;
            this.pendingResponses = [];
            this.currentResponseNum = 0;
            this.closeAfterResponse = -1;
            this.onClose = null;
        }
        closeAfter(responseNum, callback) {
            this.closeAfterResponse = responseNum;
            this.onClose = callback;
            if (this.closeAfterResponse < this.currentResponseNum) {
                this.onClose();
                this.onClose = null;
            }
        }
        /**
         * Each message from the server comes with a response number, and an array of data. The responseNumber
         * allows us to ensure that we process them in the right order, since we can't be guaranteed that all
         * browsers will respond in the same order as the requests we sent
         */
        handleResponse(requestNum, data) {
            this.pendingResponses[requestNum] = data;
            while (this.pendingResponses[this.currentResponseNum]) {
                const toProcess = this.pendingResponses[this.currentResponseNum];
                delete this.pendingResponses[this.currentResponseNum];
                for (let i = 0; i < toProcess.length; ++i) {
                    if (toProcess[i]) {
                        exceptionGuard(() => {
                            this.onMessage_(toProcess[i]);
                        });
                    }
                }
                if (this.currentResponseNum === this.closeAfterResponse) {
                    if (this.onClose) {
                        this.onClose();
                        this.onClose = null;
                    }
                    break;
                }
                this.currentResponseNum++;
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // URL query parameters associated with longpolling
    const FIREBASE_LONGPOLL_START_PARAM = 'start';
    const FIREBASE_LONGPOLL_CLOSE_COMMAND = 'close';
    const FIREBASE_LONGPOLL_COMMAND_CB_NAME = 'pLPCommand';
    const FIREBASE_LONGPOLL_DATA_CB_NAME = 'pRTLPCB';
    const FIREBASE_LONGPOLL_ID_PARAM = 'id';
    const FIREBASE_LONGPOLL_PW_PARAM = 'pw';
    const FIREBASE_LONGPOLL_SERIAL_PARAM = 'ser';
    const FIREBASE_LONGPOLL_CALLBACK_ID_PARAM = 'cb';
    const FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM = 'seg';
    const FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET = 'ts';
    const FIREBASE_LONGPOLL_DATA_PARAM = 'd';
    const FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM = 'dframe';
    //Data size constants.
    //TODO: Perf: the maximum length actually differs from browser to browser.
    // We should check what browser we're on and set accordingly.
    const MAX_URL_DATA_SIZE = 1870;
    const SEG_HEADER_SIZE = 30; //ie: &seg=8299234&ts=982389123&d=
    const MAX_PAYLOAD_SIZE = MAX_URL_DATA_SIZE - SEG_HEADER_SIZE;
    /**
     * Keepalive period
     * send a fresh request at minimum every 25 seconds. Opera has a maximum request
     * length of 30 seconds that we can't exceed.
     */
    const KEEPALIVE_REQUEST_INTERVAL = 25000;
    /**
     * How long to wait before aborting a long-polling connection attempt.
     */
    const LP_CONNECT_TIMEOUT = 30000;
    /**
     * This class manages a single long-polling connection.
     */
    class BrowserPollConnection {
        /**
         * @param connId An identifier for this connection, used for logging
         * @param repoInfo The info for the endpoint to send data to.
         * @param applicationId The Firebase App ID for this project.
         * @param appCheckToken The AppCheck token for this client.
         * @param authToken The AuthToken to use for this connection.
         * @param transportSessionId Optional transportSessionid if we are
         * reconnecting for an existing transport session
         * @param lastSessionId Optional lastSessionId if the PersistentConnection has
         * already created a connection previously
         */
        constructor(connId, repoInfo, applicationId, appCheckToken, authToken, transportSessionId, lastSessionId) {
            this.connId = connId;
            this.repoInfo = repoInfo;
            this.applicationId = applicationId;
            this.appCheckToken = appCheckToken;
            this.authToken = authToken;
            this.transportSessionId = transportSessionId;
            this.lastSessionId = lastSessionId;
            this.bytesSent = 0;
            this.bytesReceived = 0;
            this.everConnected_ = false;
            this.log_ = logWrapper(connId);
            this.stats_ = statsManagerGetCollection(repoInfo);
            this.urlFn = (params) => {
                // Always add the token if we have one.
                if (this.appCheckToken) {
                    params[APP_CHECK_TOKEN_PARAM] = this.appCheckToken;
                }
                return repoInfoConnectionURL(repoInfo, LONG_POLLING, params);
            };
        }
        /**
         * @param onMessage - Callback when messages arrive
         * @param onDisconnect - Callback with connection lost.
         */
        open(onMessage, onDisconnect) {
            this.curSegmentNum = 0;
            this.onDisconnect_ = onDisconnect;
            this.myPacketOrderer = new PacketReceiver(onMessage);
            this.isClosed_ = false;
            this.connectTimeoutTimer_ = setTimeout(() => {
                this.log_('Timed out trying to connect.');
                // Make sure we clear the host cache
                this.onClosed_();
                this.connectTimeoutTimer_ = null;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }, Math.floor(LP_CONNECT_TIMEOUT));
            // Ensure we delay the creation of the iframe until the DOM is loaded.
            executeWhenDOMReady(() => {
                if (this.isClosed_) {
                    return;
                }
                //Set up a callback that gets triggered once a connection is set up.
                this.scriptTagHolder = new FirebaseIFrameScriptHolder((...args) => {
                    const [command, arg1, arg2, arg3, arg4] = args;
                    this.incrementIncomingBytes_(args);
                    if (!this.scriptTagHolder) {
                        return; // we closed the connection.
                    }
                    if (this.connectTimeoutTimer_) {
                        clearTimeout(this.connectTimeoutTimer_);
                        this.connectTimeoutTimer_ = null;
                    }
                    this.everConnected_ = true;
                    if (command === FIREBASE_LONGPOLL_START_PARAM) {
                        this.id = arg1;
                        this.password = arg2;
                    }
                    else if (command === FIREBASE_LONGPOLL_CLOSE_COMMAND) {
                        // Don't clear the host cache. We got a response from the server, so we know it's reachable
                        if (arg1) {
                            // We aren't expecting any more data (other than what the server's already in the process of sending us
                            // through our already open polls), so don't send any more.
                            this.scriptTagHolder.sendNewPolls = false;
                            // arg1 in this case is the last response number sent by the server. We should try to receive
                            // all of the responses up to this one before closing
                            this.myPacketOrderer.closeAfter(arg1, () => {
                                this.onClosed_();
                            });
                        }
                        else {
                            this.onClosed_();
                        }
                    }
                    else {
                        throw new Error('Unrecognized command received: ' + command);
                    }
                }, (...args) => {
                    const [pN, data] = args;
                    this.incrementIncomingBytes_(args);
                    this.myPacketOrderer.handleResponse(pN, data);
                }, () => {
                    this.onClosed_();
                }, this.urlFn);
                //Send the initial request to connect. The serial number is simply to keep the browser from pulling previous results
                //from cache.
                const urlParams = {};
                urlParams[FIREBASE_LONGPOLL_START_PARAM] = 't';
                urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = Math.floor(Math.random() * 100000000);
                if (this.scriptTagHolder.uniqueCallbackIdentifier) {
                    urlParams[FIREBASE_LONGPOLL_CALLBACK_ID_PARAM] =
                        this.scriptTagHolder.uniqueCallbackIdentifier;
                }
                urlParams[VERSION_PARAM] = PROTOCOL_VERSION;
                if (this.transportSessionId) {
                    urlParams[TRANSPORT_SESSION_PARAM] = this.transportSessionId;
                }
                if (this.lastSessionId) {
                    urlParams[LAST_SESSION_PARAM] = this.lastSessionId;
                }
                if (this.applicationId) {
                    urlParams[APPLICATION_ID_PARAM] = this.applicationId;
                }
                if (this.appCheckToken) {
                    urlParams[APP_CHECK_TOKEN_PARAM] = this.appCheckToken;
                }
                if (typeof location !== 'undefined' &&
                    location.hostname &&
                    FORGE_DOMAIN_RE.test(location.hostname)) {
                    urlParams[REFERER_PARAM] = FORGE_REF;
                }
                const connectURL = this.urlFn(urlParams);
                this.log_('Connecting via long-poll to ' + connectURL);
                this.scriptTagHolder.addTag(connectURL, () => {
                    /* do nothing */
                });
            });
        }
        /**
         * Call this when a handshake has completed successfully and we want to consider the connection established
         */
        start() {
            this.scriptTagHolder.startLongPoll(this.id, this.password);
            this.addDisconnectPingFrame(this.id, this.password);
        }
        /**
         * Forces long polling to be considered as a potential transport
         */
        static forceAllow() {
            BrowserPollConnection.forceAllow_ = true;
        }
        /**
         * Forces longpolling to not be considered as a potential transport
         */
        static forceDisallow() {
            BrowserPollConnection.forceDisallow_ = true;
        }
        // Static method, use string literal so it can be accessed in a generic way
        static isAvailable() {
            if (BrowserPollConnection.forceAllow_) {
                return true;
            }
            else {
                // NOTE: In React-Native there's normally no 'document', but if you debug a React-Native app in
                // the Chrome debugger, 'document' is defined, but document.createElement is null (2015/06/08).
                return (!BrowserPollConnection.forceDisallow_ &&
                    typeof document !== 'undefined' &&
                    document.createElement != null &&
                    !isChromeExtensionContentScript() &&
                    !isWindowsStoreApp());
            }
        }
        /**
         * No-op for polling
         */
        markConnectionHealthy() { }
        /**
         * Stops polling and cleans up the iframe
         */
        shutdown_() {
            this.isClosed_ = true;
            if (this.scriptTagHolder) {
                this.scriptTagHolder.close();
                this.scriptTagHolder = null;
            }
            //remove the disconnect frame, which will trigger an XHR call to the server to tell it we're leaving.
            if (this.myDisconnFrame) {
                document.body.removeChild(this.myDisconnFrame);
                this.myDisconnFrame = null;
            }
            if (this.connectTimeoutTimer_) {
                clearTimeout(this.connectTimeoutTimer_);
                this.connectTimeoutTimer_ = null;
            }
        }
        /**
         * Triggered when this transport is closed
         */
        onClosed_() {
            if (!this.isClosed_) {
                this.log_('Longpoll is closing itself');
                this.shutdown_();
                if (this.onDisconnect_) {
                    this.onDisconnect_(this.everConnected_);
                    this.onDisconnect_ = null;
                }
            }
        }
        /**
         * External-facing close handler. RealTime has requested we shut down. Kill our connection and tell the server
         * that we've left.
         */
        close() {
            if (!this.isClosed_) {
                this.log_('Longpoll is being closed.');
                this.shutdown_();
            }
        }
        /**
         * Send the JSON object down to the server. It will need to be stringified, base64 encoded, and then
         * broken into chunks (since URLs have a small maximum length).
         * @param data - The JSON data to transmit.
         */
        send(data) {
            const dataStr = stringify(data);
            this.bytesSent += dataStr.length;
            this.stats_.incrementCounter('bytes_sent', dataStr.length);
            //first, lets get the base64-encoded data
            const base64data = base64Encode(dataStr);
            //We can only fit a certain amount in each URL, so we need to split this request
            //up into multiple pieces if it doesn't fit in one request.
            const dataSegs = splitStringBySize(base64data, MAX_PAYLOAD_SIZE);
            //Enqueue each segment for transmission. We assign each chunk a sequential ID and a total number
            //of segments so that we can reassemble the packet on the server.
            for (let i = 0; i < dataSegs.length; i++) {
                this.scriptTagHolder.enqueueSegment(this.curSegmentNum, dataSegs.length, dataSegs[i]);
                this.curSegmentNum++;
            }
        }
        /**
         * This is how we notify the server that we're leaving.
         * We aren't able to send requests with DHTML on a window close event, but we can
         * trigger XHR requests in some browsers (everything but Opera basically).
         */
        addDisconnectPingFrame(id, pw) {
            this.myDisconnFrame = document.createElement('iframe');
            const urlParams = {};
            urlParams[FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM] = 't';
            urlParams[FIREBASE_LONGPOLL_ID_PARAM] = id;
            urlParams[FIREBASE_LONGPOLL_PW_PARAM] = pw;
            this.myDisconnFrame.src = this.urlFn(urlParams);
            this.myDisconnFrame.style.display = 'none';
            document.body.appendChild(this.myDisconnFrame);
        }
        /**
         * Used to track the bytes received by this client
         */
        incrementIncomingBytes_(args) {
            // TODO: This is an annoying perf hit just to track the number of incoming bytes.  Maybe it should be opt-in.
            const bytesReceived = stringify(args).length;
            this.bytesReceived += bytesReceived;
            this.stats_.incrementCounter('bytes_received', bytesReceived);
        }
    }
    /*********************************************************************************************
     * A wrapper around an iframe that is used as a long-polling script holder.
     *********************************************************************************************/
    class FirebaseIFrameScriptHolder {
        /**
         * @param commandCB - The callback to be called when control commands are recevied from the server.
         * @param onMessageCB - The callback to be triggered when responses arrive from the server.
         * @param onDisconnect - The callback to be triggered when this tag holder is closed
         * @param urlFn - A function that provides the URL of the endpoint to send data to.
         */
        constructor(commandCB, onMessageCB, onDisconnect, urlFn) {
            this.onDisconnect = onDisconnect;
            this.urlFn = urlFn;
            //We maintain a count of all of the outstanding requests, because if we have too many active at once it can cause
            //problems in some browsers.
            this.outstandingRequests = new Set();
            //A queue of the pending segments waiting for transmission to the server.
            this.pendingSegs = [];
            //A serial number. We use this for two things:
            // 1) A way to ensure the browser doesn't cache responses to polls
            // 2) A way to make the server aware when long-polls arrive in a different order than we started them. The
            //    server needs to release both polls in this case or it will cause problems in Opera since Opera can only execute
            //    JSONP code in the order it was added to the iframe.
            this.currentSerial = Math.floor(Math.random() * 100000000);
            // This gets set to false when we're "closing down" the connection (e.g. we're switching transports but there's still
            // incoming data from the server that we're waiting for).
            this.sendNewPolls = true;
            {
                //Each script holder registers a couple of uniquely named callbacks with the window. These are called from the
                //iframes where we put the long-polling script tags. We have two callbacks:
                //   1) Command Callback - Triggered for control issues, like starting a connection.
                //   2) Message Callback - Triggered when new data arrives.
                this.uniqueCallbackIdentifier = LUIDGenerator();
                window[FIREBASE_LONGPOLL_COMMAND_CB_NAME + this.uniqueCallbackIdentifier] = commandCB;
                window[FIREBASE_LONGPOLL_DATA_CB_NAME + this.uniqueCallbackIdentifier] =
                    onMessageCB;
                //Create an iframe for us to add script tags to.
                this.myIFrame = FirebaseIFrameScriptHolder.createIFrame_();
                // Set the iframe's contents.
                let script = '';
                // if we set a javascript url, it's IE and we need to set the document domain. The javascript url is sufficient
                // for ie9, but ie8 needs to do it again in the document itself.
                if (this.myIFrame.src &&
                    this.myIFrame.src.substr(0, 'javascript:'.length) === 'javascript:') {
                    const currentDomain = document.domain;
                    script = '<script>document.domain="' + currentDomain + '";</script>';
                }
                const iframeContents = '<html><body>' + script + '</body></html>';
                try {
                    this.myIFrame.doc.open();
                    this.myIFrame.doc.write(iframeContents);
                    this.myIFrame.doc.close();
                }
                catch (e) {
                    log('frame writing exception');
                    if (e.stack) {
                        log(e.stack);
                    }
                    log(e);
                }
            }
        }
        /**
         * Each browser has its own funny way to handle iframes. Here we mush them all together into one object that I can
         * actually use.
         */
        static createIFrame_() {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            // This is necessary in order to initialize the document inside the iframe
            if (document.body) {
                document.body.appendChild(iframe);
                try {
                    // If document.domain has been modified in IE, this will throw an error, and we need to set the
                    // domain of the iframe's document manually. We can do this via a javascript: url as the src attribute
                    // Also note that we must do this *after* the iframe has been appended to the page. Otherwise it doesn't work.
                    const a = iframe.contentWindow.document;
                    if (!a) {
                        // Apologies for the log-spam, I need to do something to keep closure from optimizing out the assignment above.
                        log('No IE domain setting required');
                    }
                }
                catch (e) {
                    const domain = document.domain;
                    iframe.src =
                        "javascript:void((function(){document.open();document.domain='" +
                            domain +
                            "';document.close();})())";
                }
            }
            else {
                // LongPollConnection attempts to delay initialization until the document is ready, so hopefully this
                // never gets hit.
                throw 'Document body has not initialized. Wait to initialize Firebase until after the document is ready.';
            }
            // Get the document of the iframe in a browser-specific way.
            if (iframe.contentDocument) {
                iframe.doc = iframe.contentDocument; // Firefox, Opera, Safari
            }
            else if (iframe.contentWindow) {
                iframe.doc = iframe.contentWindow.document; // Internet Explorer
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }
            else if (iframe.document) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                iframe.doc = iframe.document; //others?
            }
            return iframe;
        }
        /**
         * Cancel all outstanding queries and remove the frame.
         */
        close() {
            //Mark this iframe as dead, so no new requests are sent.
            this.alive = false;
            if (this.myIFrame) {
                //We have to actually remove all of the html inside this iframe before removing it from the
                //window, or IE will continue loading and executing the script tags we've already added, which
                //can lead to some errors being thrown. Setting textContent seems to be the safest way to do this.
                this.myIFrame.doc.body.textContent = '';
                setTimeout(() => {
                    if (this.myIFrame !== null) {
                        document.body.removeChild(this.myIFrame);
                        this.myIFrame = null;
                    }
                }, Math.floor(0));
            }
            // Protect from being called recursively.
            const onDisconnect = this.onDisconnect;
            if (onDisconnect) {
                this.onDisconnect = null;
                onDisconnect();
            }
        }
        /**
         * Actually start the long-polling session by adding the first script tag(s) to the iframe.
         * @param id - The ID of this connection
         * @param pw - The password for this connection
         */
        startLongPoll(id, pw) {
            this.myID = id;
            this.myPW = pw;
            this.alive = true;
            //send the initial request. If there are requests queued, make sure that we transmit as many as we are currently able to.
            while (this.newRequest_()) { }
        }
        /**
         * This is called any time someone might want a script tag to be added. It adds a script tag when there aren't
         * too many outstanding requests and we are still alive.
         *
         * If there are outstanding packet segments to send, it sends one. If there aren't, it sends a long-poll anyways if
         * needed.
         */
        newRequest_() {
            // We keep one outstanding request open all the time to receive data, but if we need to send data
            // (pendingSegs.length > 0) then we create a new request to send the data.  The server will automatically
            // close the old request.
            if (this.alive &&
                this.sendNewPolls &&
                this.outstandingRequests.size < (this.pendingSegs.length > 0 ? 2 : 1)) {
                //construct our url
                this.currentSerial++;
                const urlParams = {};
                urlParams[FIREBASE_LONGPOLL_ID_PARAM] = this.myID;
                urlParams[FIREBASE_LONGPOLL_PW_PARAM] = this.myPW;
                urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM] = this.currentSerial;
                let theURL = this.urlFn(urlParams);
                //Now add as much data as we can.
                let curDataString = '';
                let i = 0;
                while (this.pendingSegs.length > 0) {
                    //first, lets see if the next segment will fit.
                    const nextSeg = this.pendingSegs[0];
                    if (nextSeg.d.length +
                        SEG_HEADER_SIZE +
                        curDataString.length <=
                        MAX_URL_DATA_SIZE) {
                        //great, the segment will fit. Lets append it.
                        const theSeg = this.pendingSegs.shift();
                        curDataString =
                            curDataString +
                                '&' +
                                FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM +
                                i +
                                '=' +
                                theSeg.seg +
                                '&' +
                                FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET +
                                i +
                                '=' +
                                theSeg.ts +
                                '&' +
                                FIREBASE_LONGPOLL_DATA_PARAM +
                                i +
                                '=' +
                                theSeg.d;
                        i++;
                    }
                    else {
                        break;
                    }
                }
                theURL = theURL + curDataString;
                this.addLongPollTag_(theURL, this.currentSerial);
                return true;
            }
            else {
                return false;
            }
        }
        /**
         * Queue a packet for transmission to the server.
         * @param segnum - A sequential id for this packet segment used for reassembly
         * @param totalsegs - The total number of segments in this packet
         * @param data - The data for this segment.
         */
        enqueueSegment(segnum, totalsegs, data) {
            //add this to the queue of segments to send.
            this.pendingSegs.push({ seg: segnum, ts: totalsegs, d: data });
            //send the data immediately if there isn't already data being transmitted, unless
            //startLongPoll hasn't been called yet.
            if (this.alive) {
                this.newRequest_();
            }
        }
        /**
         * Add a script tag for a regular long-poll request.
         * @param url - The URL of the script tag.
         * @param serial - The serial number of the request.
         */
        addLongPollTag_(url, serial) {
            //remember that we sent this request.
            this.outstandingRequests.add(serial);
            const doNewRequest = () => {
                this.outstandingRequests.delete(serial);
                this.newRequest_();
            };
            // If this request doesn't return on its own accord (by the server sending us some data), we'll
            // create a new one after the KEEPALIVE interval to make sure we always keep a fresh request open.
            const keepaliveTimeout = setTimeout(doNewRequest, Math.floor(KEEPALIVE_REQUEST_INTERVAL));
            const readyStateCB = () => {
                // Request completed.  Cancel the keepalive.
                clearTimeout(keepaliveTimeout);
                // Trigger a new request so we can continue receiving data.
                doNewRequest();
            };
            this.addTag(url, readyStateCB);
        }
        /**
         * Add an arbitrary script tag to the iframe.
         * @param url - The URL for the script tag source.
         * @param loadCB - A callback to be triggered once the script has loaded.
         */
        addTag(url, loadCB) {
            {
                setTimeout(() => {
                    try {
                        // if we're already closed, don't add this poll
                        if (!this.sendNewPolls) {
                            return;
                        }
                        const newScript = this.myIFrame.doc.createElement('script');
                        newScript.type = 'text/javascript';
                        newScript.async = true;
                        newScript.src = url;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        newScript.onload = newScript.onreadystatechange =
                            function () {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const rstate = newScript.readyState;
                                if (!rstate || rstate === 'loaded' || rstate === 'complete') {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    newScript.onload = newScript.onreadystatechange = null;
                                    if (newScript.parentNode) {
                                        newScript.parentNode.removeChild(newScript);
                                    }
                                    loadCB();
                                }
                            };
                        newScript.onerror = () => {
                            log('Long-poll script failed to load: ' + url);
                            this.sendNewPolls = false;
                            this.close();
                        };
                        this.myIFrame.doc.body.appendChild(newScript);
                    }
                    catch (e) {
                        // TODO: we should make this error visible somehow
                    }
                }, Math.floor(1));
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const WEBSOCKET_MAX_FRAME_SIZE = 16384;
    const WEBSOCKET_KEEPALIVE_INTERVAL = 45000;
    let WebSocketImpl = null;
    if (typeof MozWebSocket !== 'undefined') {
        WebSocketImpl = MozWebSocket;
    }
    else if (typeof WebSocket !== 'undefined') {
        WebSocketImpl = WebSocket;
    }
    /**
     * Create a new websocket connection with the given callbacks.
     */
    class WebSocketConnection {
        /**
         * @param connId identifier for this transport
         * @param repoInfo The info for the websocket endpoint.
         * @param applicationId The Firebase App ID for this project.
         * @param appCheckToken The App Check Token for this client.
         * @param authToken The Auth Token for this client.
         * @param transportSessionId Optional transportSessionId if this is connecting
         * to an existing transport session
         * @param lastSessionId Optional lastSessionId if there was a previous
         * connection
         */
        constructor(connId, repoInfo, applicationId, appCheckToken, authToken, transportSessionId, lastSessionId) {
            this.connId = connId;
            this.applicationId = applicationId;
            this.appCheckToken = appCheckToken;
            this.authToken = authToken;
            this.keepaliveTimer = null;
            this.frames = null;
            this.totalFrames = 0;
            this.bytesSent = 0;
            this.bytesReceived = 0;
            this.log_ = logWrapper(this.connId);
            this.stats_ = statsManagerGetCollection(repoInfo);
            this.connURL = WebSocketConnection.connectionURL_(repoInfo, transportSessionId, lastSessionId, appCheckToken, applicationId);
            this.nodeAdmin = repoInfo.nodeAdmin;
        }
        /**
         * @param repoInfo - The info for the websocket endpoint.
         * @param transportSessionId - Optional transportSessionId if this is connecting to an existing transport
         *                                         session
         * @param lastSessionId - Optional lastSessionId if there was a previous connection
         * @returns connection url
         */
        static connectionURL_(repoInfo, transportSessionId, lastSessionId, appCheckToken, applicationId) {
            const urlParams = {};
            urlParams[VERSION_PARAM] = PROTOCOL_VERSION;
            if (typeof location !== 'undefined' &&
                location.hostname &&
                FORGE_DOMAIN_RE.test(location.hostname)) {
                urlParams[REFERER_PARAM] = FORGE_REF;
            }
            if (transportSessionId) {
                urlParams[TRANSPORT_SESSION_PARAM] = transportSessionId;
            }
            if (lastSessionId) {
                urlParams[LAST_SESSION_PARAM] = lastSessionId;
            }
            if (appCheckToken) {
                urlParams[APP_CHECK_TOKEN_PARAM] = appCheckToken;
            }
            if (applicationId) {
                urlParams[APPLICATION_ID_PARAM] = applicationId;
            }
            return repoInfoConnectionURL(repoInfo, WEBSOCKET, urlParams);
        }
        /**
         * @param onMessage - Callback when messages arrive
         * @param onDisconnect - Callback with connection lost.
         */
        open(onMessage, onDisconnect) {
            this.onDisconnect = onDisconnect;
            this.onMessage = onMessage;
            this.log_('Websocket connecting to ' + this.connURL);
            this.everConnected_ = false;
            // Assume failure until proven otherwise.
            PersistentStorage.set('previous_websocket_failure', true);
            try {
                let options;
                if (isNodeSdk()) ;
                this.mySock = new WebSocketImpl(this.connURL, [], options);
            }
            catch (e) {
                this.log_('Error instantiating WebSocket.');
                const error = e.message || e.data;
                if (error) {
                    this.log_(error);
                }
                this.onClosed_();
                return;
            }
            this.mySock.onopen = () => {
                this.log_('Websocket connected.');
                this.everConnected_ = true;
            };
            this.mySock.onclose = () => {
                this.log_('Websocket connection was disconnected.');
                this.mySock = null;
                this.onClosed_();
            };
            this.mySock.onmessage = m => {
                this.handleIncomingFrame(m);
            };
            this.mySock.onerror = e => {
                this.log_('WebSocket error.  Closing connection.');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error = e.message || e.data;
                if (error) {
                    this.log_(error);
                }
                this.onClosed_();
            };
        }
        /**
         * No-op for websockets, we don't need to do anything once the connection is confirmed as open
         */
        start() { }
        static forceDisallow() {
            WebSocketConnection.forceDisallow_ = true;
        }
        static isAvailable() {
            let isOldAndroid = false;
            if (typeof navigator !== 'undefined' && navigator.userAgent) {
                const oldAndroidRegex = /Android ([0-9]{0,}\.[0-9]{0,})/;
                const oldAndroidMatch = navigator.userAgent.match(oldAndroidRegex);
                if (oldAndroidMatch && oldAndroidMatch.length > 1) {
                    if (parseFloat(oldAndroidMatch[1]) < 4.4) {
                        isOldAndroid = true;
                    }
                }
            }
            return (!isOldAndroid &&
                WebSocketImpl !== null &&
                !WebSocketConnection.forceDisallow_);
        }
        /**
         * Returns true if we previously failed to connect with this transport.
         */
        static previouslyFailed() {
            // If our persistent storage is actually only in-memory storage,
            // we default to assuming that it previously failed to be safe.
            return (PersistentStorage.isInMemoryStorage ||
                PersistentStorage.get('previous_websocket_failure') === true);
        }
        markConnectionHealthy() {
            PersistentStorage.remove('previous_websocket_failure');
        }
        appendFrame_(data) {
            this.frames.push(data);
            if (this.frames.length === this.totalFrames) {
                const fullMess = this.frames.join('');
                this.frames = null;
                const jsonMess = jsonEval(fullMess);
                //handle the message
                this.onMessage(jsonMess);
            }
        }
        /**
         * @param frameCount - The number of frames we are expecting from the server
         */
        handleNewFrameCount_(frameCount) {
            this.totalFrames = frameCount;
            this.frames = [];
        }
        /**
         * Attempts to parse a frame count out of some text. If it can't, assumes a value of 1
         * @returns Any remaining data to be process, or null if there is none
         */
        extractFrameCount_(data) {
            assert(this.frames === null, 'We already have a frame buffer');
            // TODO: The server is only supposed to send up to 9999 frames (i.e. length <= 4), but that isn't being enforced
            // currently.  So allowing larger frame counts (length <= 6).  See https://app.asana.com/0/search/8688598998380/8237608042508
            if (data.length <= 6) {
                const frameCount = Number(data);
                if (!isNaN(frameCount)) {
                    this.handleNewFrameCount_(frameCount);
                    return null;
                }
            }
            this.handleNewFrameCount_(1);
            return data;
        }
        /**
         * Process a websocket frame that has arrived from the server.
         * @param mess - The frame data
         */
        handleIncomingFrame(mess) {
            if (this.mySock === null) {
                return; // Chrome apparently delivers incoming packets even after we .close() the connection sometimes.
            }
            const data = mess['data'];
            this.bytesReceived += data.length;
            this.stats_.incrementCounter('bytes_received', data.length);
            this.resetKeepAlive();
            if (this.frames !== null) {
                // we're buffering
                this.appendFrame_(data);
            }
            else {
                // try to parse out a frame count, otherwise, assume 1 and process it
                const remainingData = this.extractFrameCount_(data);
                if (remainingData !== null) {
                    this.appendFrame_(remainingData);
                }
            }
        }
        /**
         * Send a message to the server
         * @param data - The JSON object to transmit
         */
        send(data) {
            this.resetKeepAlive();
            const dataStr = stringify(data);
            this.bytesSent += dataStr.length;
            this.stats_.incrementCounter('bytes_sent', dataStr.length);
            //We can only fit a certain amount in each websocket frame, so we need to split this request
            //up into multiple pieces if it doesn't fit in one request.
            const dataSegs = splitStringBySize(dataStr, WEBSOCKET_MAX_FRAME_SIZE);
            //Send the length header
            if (dataSegs.length > 1) {
                this.sendString_(String(dataSegs.length));
            }
            //Send the actual data in segments.
            for (let i = 0; i < dataSegs.length; i++) {
                this.sendString_(dataSegs[i]);
            }
        }
        shutdown_() {
            this.isClosed_ = true;
            if (this.keepaliveTimer) {
                clearInterval(this.keepaliveTimer);
                this.keepaliveTimer = null;
            }
            if (this.mySock) {
                this.mySock.close();
                this.mySock = null;
            }
        }
        onClosed_() {
            if (!this.isClosed_) {
                this.log_('WebSocket is closing itself');
                this.shutdown_();
                // since this is an internal close, trigger the close listener
                if (this.onDisconnect) {
                    this.onDisconnect(this.everConnected_);
                    this.onDisconnect = null;
                }
            }
        }
        /**
         * External-facing close handler.
         * Close the websocket and kill the connection.
         */
        close() {
            if (!this.isClosed_) {
                this.log_('WebSocket is being closed');
                this.shutdown_();
            }
        }
        /**
         * Kill the current keepalive timer and start a new one, to ensure that it always fires N seconds after
         * the last activity.
         */
        resetKeepAlive() {
            clearInterval(this.keepaliveTimer);
            this.keepaliveTimer = setInterval(() => {
                //If there has been no websocket activity for a while, send a no-op
                if (this.mySock) {
                    this.sendString_('0');
                }
                this.resetKeepAlive();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }, Math.floor(WEBSOCKET_KEEPALIVE_INTERVAL));
        }
        /**
         * Send a string over the websocket.
         *
         * @param str - String to send.
         */
        sendString_(str) {
            // Firefox seems to sometimes throw exceptions (NS_ERROR_UNEXPECTED) from websocket .send()
            // calls for some unknown reason.  We treat these as an error and disconnect.
            // See https://app.asana.com/0/58926111402292/68021340250410
            try {
                this.mySock.send(str);
            }
            catch (e) {
                this.log_('Exception thrown from WebSocket.send():', e.message || e.data, 'Closing connection.');
                setTimeout(this.onClosed_.bind(this), 0);
            }
        }
    }
    /**
     * Number of response before we consider the connection "healthy."
     */
    WebSocketConnection.responsesRequiredToBeHealthy = 2;
    /**
     * Time to wait for the connection te become healthy before giving up.
     */
    WebSocketConnection.healthyTimeout = 30000;

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Currently simplistic, this class manages what transport a Connection should use at various stages of its
     * lifecycle.
     *
     * It starts with longpolling in a browser, and httppolling on node. It then upgrades to websockets if
     * they are available.
     */
    class TransportManager {
        /**
         * @param repoInfo - Metadata around the namespace we're connecting to
         */
        constructor(repoInfo) {
            this.initTransports_(repoInfo);
        }
        static get ALL_TRANSPORTS() {
            return [BrowserPollConnection, WebSocketConnection];
        }
        /**
         * Returns whether transport has been selected to ensure WebSocketConnection or BrowserPollConnection are not called after
         * TransportManager has already set up transports_
         */
        static get IS_TRANSPORT_INITIALIZED() {
            return this.globalTransportInitialized_;
        }
        initTransports_(repoInfo) {
            const isWebSocketsAvailable = WebSocketConnection && WebSocketConnection['isAvailable']();
            let isSkipPollConnection = isWebSocketsAvailable && !WebSocketConnection.previouslyFailed();
            if (repoInfo.webSocketOnly) {
                if (!isWebSocketsAvailable) {
                    warn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway.");
                }
                isSkipPollConnection = true;
            }
            if (isSkipPollConnection) {
                this.transports_ = [WebSocketConnection];
            }
            else {
                const transports = (this.transports_ = []);
                for (const transport of TransportManager.ALL_TRANSPORTS) {
                    if (transport && transport['isAvailable']()) {
                        transports.push(transport);
                    }
                }
                TransportManager.globalTransportInitialized_ = true;
            }
        }
        /**
         * @returns The constructor for the initial transport to use
         */
        initialTransport() {
            if (this.transports_.length > 0) {
                return this.transports_[0];
            }
            else {
                throw new Error('No transports available');
            }
        }
        /**
         * @returns The constructor for the next transport, or null
         */
        upgradeTransport() {
            if (this.transports_.length > 1) {
                return this.transports_[1];
            }
            else {
                return null;
            }
        }
    }
    // Keeps track of whether the TransportManager has already chosen a transport to use
    TransportManager.globalTransportInitialized_ = false;

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // Abort upgrade attempt if it takes longer than 60s.
    const UPGRADE_TIMEOUT = 60000;
    // For some transports (WebSockets), we need to "validate" the transport by exchanging a few requests and responses.
    // If we haven't sent enough requests within 5s, we'll start sending noop ping requests.
    const DELAY_BEFORE_SENDING_EXTRA_REQUESTS = 5000;
    // If the initial data sent triggers a lot of bandwidth (i.e. it's a large put or a listen for a large amount of data)
    // then we may not be able to exchange our ping/pong requests within the healthy timeout.  So if we reach the timeout
    // but we've sent/received enough bytes, we don't cancel the connection.
    const BYTES_SENT_HEALTHY_OVERRIDE = 10 * 1024;
    const BYTES_RECEIVED_HEALTHY_OVERRIDE = 100 * 1024;
    const MESSAGE_TYPE = 't';
    const MESSAGE_DATA = 'd';
    const CONTROL_SHUTDOWN = 's';
    const CONTROL_RESET = 'r';
    const CONTROL_ERROR = 'e';
    const CONTROL_PONG = 'o';
    const SWITCH_ACK = 'a';
    const END_TRANSMISSION = 'n';
    const PING = 'p';
    const SERVER_HELLO = 'h';
    /**
     * Creates a new real-time connection to the server using whichever method works
     * best in the current browser.
     */
    class Connection {
        /**
         * @param id - an id for this connection
         * @param repoInfo_ - the info for the endpoint to connect to
         * @param applicationId_ - the Firebase App ID for this project
         * @param appCheckToken_ - The App Check Token for this device.
         * @param authToken_ - The auth token for this session.
         * @param onMessage_ - the callback to be triggered when a server-push message arrives
         * @param onReady_ - the callback to be triggered when this connection is ready to send messages.
         * @param onDisconnect_ - the callback to be triggered when a connection was lost
         * @param onKill_ - the callback to be triggered when this connection has permanently shut down.
         * @param lastSessionId - last session id in persistent connection. is used to clean up old session in real-time server
         */
        constructor(id, repoInfo_, applicationId_, appCheckToken_, authToken_, onMessage_, onReady_, onDisconnect_, onKill_, lastSessionId) {
            this.id = id;
            this.repoInfo_ = repoInfo_;
            this.applicationId_ = applicationId_;
            this.appCheckToken_ = appCheckToken_;
            this.authToken_ = authToken_;
            this.onMessage_ = onMessage_;
            this.onReady_ = onReady_;
            this.onDisconnect_ = onDisconnect_;
            this.onKill_ = onKill_;
            this.lastSessionId = lastSessionId;
            this.connectionCount = 0;
            this.pendingDataMessages = [];
            this.state_ = 0 /* RealtimeState.CONNECTING */;
            this.log_ = logWrapper('c:' + this.id + ':');
            this.transportManager_ = new TransportManager(repoInfo_);
            this.log_('Connection created');
            this.start_();
        }
        /**
         * Starts a connection attempt
         */
        start_() {
            const conn = this.transportManager_.initialTransport();
            this.conn_ = new conn(this.nextTransportId_(), this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, null, this.lastSessionId);
            // For certain transports (WebSockets), we need to send and receive several messages back and forth before we
            // can consider the transport healthy.
            this.primaryResponsesRequired_ = conn['responsesRequiredToBeHealthy'] || 0;
            const onMessageReceived = this.connReceiver_(this.conn_);
            const onConnectionLost = this.disconnReceiver_(this.conn_);
            this.tx_ = this.conn_;
            this.rx_ = this.conn_;
            this.secondaryConn_ = null;
            this.isHealthy_ = false;
            /*
             * Firefox doesn't like when code from one iframe tries to create another iframe by way of the parent frame.
             * This can occur in the case of a redirect, i.e. we guessed wrong on what server to connect to and received a reset.
             * Somehow, setTimeout seems to make this ok. That doesn't make sense from a security perspective, since you should
             * still have the context of your originating frame.
             */
            setTimeout(() => {
                // this.conn_ gets set to null in some of the tests. Check to make sure it still exists before using it
                this.conn_ && this.conn_.open(onMessageReceived, onConnectionLost);
            }, Math.floor(0));
            const healthyTimeoutMS = conn['healthyTimeout'] || 0;
            if (healthyTimeoutMS > 0) {
                this.healthyTimeout_ = setTimeoutNonBlocking(() => {
                    this.healthyTimeout_ = null;
                    if (!this.isHealthy_) {
                        if (this.conn_ &&
                            this.conn_.bytesReceived > BYTES_RECEIVED_HEALTHY_OVERRIDE) {
                            this.log_('Connection exceeded healthy timeout but has received ' +
                                this.conn_.bytesReceived +
                                ' bytes.  Marking connection healthy.');
                            this.isHealthy_ = true;
                            this.conn_.markConnectionHealthy();
                        }
                        else if (this.conn_ &&
                            this.conn_.bytesSent > BYTES_SENT_HEALTHY_OVERRIDE) {
                            this.log_('Connection exceeded healthy timeout but has sent ' +
                                this.conn_.bytesSent +
                                ' bytes.  Leaving connection alive.');
                            // NOTE: We don't want to mark it healthy, since we have no guarantee that the bytes have made it to
                            // the server.
                        }
                        else {
                            this.log_('Closing unhealthy connection after timeout.');
                            this.close();
                        }
                    }
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }, Math.floor(healthyTimeoutMS));
            }
        }
        nextTransportId_() {
            return 'c:' + this.id + ':' + this.connectionCount++;
        }
        disconnReceiver_(conn) {
            return everConnected => {
                if (conn === this.conn_) {
                    this.onConnectionLost_(everConnected);
                }
                else if (conn === this.secondaryConn_) {
                    this.log_('Secondary connection lost.');
                    this.onSecondaryConnectionLost_();
                }
                else {
                    this.log_('closing an old connection');
                }
            };
        }
        connReceiver_(conn) {
            return (message) => {
                if (this.state_ !== 2 /* RealtimeState.DISCONNECTED */) {
                    if (conn === this.rx_) {
                        this.onPrimaryMessageReceived_(message);
                    }
                    else if (conn === this.secondaryConn_) {
                        this.onSecondaryMessageReceived_(message);
                    }
                    else {
                        this.log_('message on old connection');
                    }
                }
            };
        }
        /**
         * @param dataMsg - An arbitrary data message to be sent to the server
         */
        sendRequest(dataMsg) {
            // wrap in a data message envelope and send it on
            const msg = { t: 'd', d: dataMsg };
            this.sendData_(msg);
        }
        tryCleanupConnection() {
            if (this.tx_ === this.secondaryConn_ && this.rx_ === this.secondaryConn_) {
                this.log_('cleaning up and promoting a connection: ' + this.secondaryConn_.connId);
                this.conn_ = this.secondaryConn_;
                this.secondaryConn_ = null;
                // the server will shutdown the old connection
            }
        }
        onSecondaryControl_(controlData) {
            if (MESSAGE_TYPE in controlData) {
                const cmd = controlData[MESSAGE_TYPE];
                if (cmd === SWITCH_ACK) {
                    this.upgradeIfSecondaryHealthy_();
                }
                else if (cmd === CONTROL_RESET) {
                    // Most likely the session wasn't valid. Abandon the switch attempt
                    this.log_('Got a reset on secondary, closing it');
                    this.secondaryConn_.close();
                    // If we were already using this connection for something, than we need to fully close
                    if (this.tx_ === this.secondaryConn_ ||
                        this.rx_ === this.secondaryConn_) {
                        this.close();
                    }
                }
                else if (cmd === CONTROL_PONG) {
                    this.log_('got pong on secondary.');
                    this.secondaryResponsesRequired_--;
                    this.upgradeIfSecondaryHealthy_();
                }
            }
        }
        onSecondaryMessageReceived_(parsedData) {
            const layer = requireKey('t', parsedData);
            const data = requireKey('d', parsedData);
            if (layer === 'c') {
                this.onSecondaryControl_(data);
            }
            else if (layer === 'd') {
                // got a data message, but we're still second connection. Need to buffer it up
                this.pendingDataMessages.push(data);
            }
            else {
                throw new Error('Unknown protocol layer: ' + layer);
            }
        }
        upgradeIfSecondaryHealthy_() {
            if (this.secondaryResponsesRequired_ <= 0) {
                this.log_('Secondary connection is healthy.');
                this.isHealthy_ = true;
                this.secondaryConn_.markConnectionHealthy();
                this.proceedWithUpgrade_();
            }
            else {
                // Send a ping to make sure the connection is healthy.
                this.log_('sending ping on secondary.');
                this.secondaryConn_.send({ t: 'c', d: { t: PING, d: {} } });
            }
        }
        proceedWithUpgrade_() {
            // tell this connection to consider itself open
            this.secondaryConn_.start();
            // send ack
            this.log_('sending client ack on secondary');
            this.secondaryConn_.send({ t: 'c', d: { t: SWITCH_ACK, d: {} } });
            // send end packet on primary transport, switch to sending on this one
            // can receive on this one, buffer responses until end received on primary transport
            this.log_('Ending transmission on primary');
            this.conn_.send({ t: 'c', d: { t: END_TRANSMISSION, d: {} } });
            this.tx_ = this.secondaryConn_;
            this.tryCleanupConnection();
        }
        onPrimaryMessageReceived_(parsedData) {
            // Must refer to parsedData properties in quotes, so closure doesn't touch them.
            const layer = requireKey('t', parsedData);
            const data = requireKey('d', parsedData);
            if (layer === 'c') {
                this.onControl_(data);
            }
            else if (layer === 'd') {
                this.onDataMessage_(data);
            }
        }
        onDataMessage_(message) {
            this.onPrimaryResponse_();
            // We don't do anything with data messages, just kick them up a level
            this.onMessage_(message);
        }
        onPrimaryResponse_() {
            if (!this.isHealthy_) {
                this.primaryResponsesRequired_--;
                if (this.primaryResponsesRequired_ <= 0) {
                    this.log_('Primary connection is healthy.');
                    this.isHealthy_ = true;
                    this.conn_.markConnectionHealthy();
                }
            }
        }
        onControl_(controlData) {
            const cmd = requireKey(MESSAGE_TYPE, controlData);
            if (MESSAGE_DATA in controlData) {
                const payload = controlData[MESSAGE_DATA];
                if (cmd === SERVER_HELLO) {
                    const handshakePayload = Object.assign({}, payload);
                    if (this.repoInfo_.isUsingEmulator) {
                        // Upon connecting, the emulator will pass the hostname that it's aware of, but we prefer the user's set hostname via `connectDatabaseEmulator` over what the emulator passes.
                        handshakePayload.h = this.repoInfo_.host;
                    }
                    this.onHandshake_(handshakePayload);
                }
                else if (cmd === END_TRANSMISSION) {
                    this.log_('recvd end transmission on primary');
                    this.rx_ = this.secondaryConn_;
                    for (let i = 0; i < this.pendingDataMessages.length; ++i) {
                        this.onDataMessage_(this.pendingDataMessages[i]);
                    }
                    this.pendingDataMessages = [];
                    this.tryCleanupConnection();
                }
                else if (cmd === CONTROL_SHUTDOWN) {
                    // This was previously the 'onKill' callback passed to the lower-level connection
                    // payload in this case is the reason for the shutdown. Generally a human-readable error
                    this.onConnectionShutdown_(payload);
                }
                else if (cmd === CONTROL_RESET) {
                    // payload in this case is the host we should contact
                    this.onReset_(payload);
                }
                else if (cmd === CONTROL_ERROR) {
                    error('Server Error: ' + payload);
                }
                else if (cmd === CONTROL_PONG) {
                    this.log_('got pong on primary.');
                    this.onPrimaryResponse_();
                    this.sendPingOnPrimaryIfNecessary_();
                }
                else {
                    error('Unknown control packet command: ' + cmd);
                }
            }
        }
        /**
         * @param handshake - The handshake data returned from the server
         */
        onHandshake_(handshake) {
            const timestamp = handshake.ts;
            const version = handshake.v;
            const host = handshake.h;
            this.sessionId = handshake.s;
            this.repoInfo_.host = host;
            // if we've already closed the connection, then don't bother trying to progress further
            if (this.state_ === 0 /* RealtimeState.CONNECTING */) {
                this.conn_.start();
                this.onConnectionEstablished_(this.conn_, timestamp);
                if (PROTOCOL_VERSION !== version) {
                    warn('Protocol version mismatch detected');
                }
                // TODO: do we want to upgrade? when? maybe a delay?
                this.tryStartUpgrade_();
            }
        }
        tryStartUpgrade_() {
            const conn = this.transportManager_.upgradeTransport();
            if (conn) {
                this.startUpgrade_(conn);
            }
        }
        startUpgrade_(conn) {
            this.secondaryConn_ = new conn(this.nextTransportId_(), this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, this.sessionId);
            // For certain transports (WebSockets), we need to send and receive several messages back and forth before we
            // can consider the transport healthy.
            this.secondaryResponsesRequired_ =
                conn['responsesRequiredToBeHealthy'] || 0;
            const onMessage = this.connReceiver_(this.secondaryConn_);
            const onDisconnect = this.disconnReceiver_(this.secondaryConn_);
            this.secondaryConn_.open(onMessage, onDisconnect);
            // If we haven't successfully upgraded after UPGRADE_TIMEOUT, give up and kill the secondary.
            setTimeoutNonBlocking(() => {
                if (this.secondaryConn_) {
                    this.log_('Timed out trying to upgrade.');
                    this.secondaryConn_.close();
                }
            }, Math.floor(UPGRADE_TIMEOUT));
        }
        onReset_(host) {
            this.log_('Reset packet received.  New host: ' + host);
            this.repoInfo_.host = host;
            // TODO: if we're already "connected", we need to trigger a disconnect at the next layer up.
            // We don't currently support resets after the connection has already been established
            if (this.state_ === 1 /* RealtimeState.CONNECTED */) {
                this.close();
            }
            else {
                // Close whatever connections we have open and start again.
                this.closeConnections_();
                this.start_();
            }
        }
        onConnectionEstablished_(conn, timestamp) {
            this.log_('Realtime connection established.');
            this.conn_ = conn;
            this.state_ = 1 /* RealtimeState.CONNECTED */;
            if (this.onReady_) {
                this.onReady_(timestamp, this.sessionId);
                this.onReady_ = null;
            }
            // If after 5 seconds we haven't sent enough requests to the server to get the connection healthy,
            // send some pings.
            if (this.primaryResponsesRequired_ === 0) {
                this.log_('Primary connection is healthy.');
                this.isHealthy_ = true;
            }
            else {
                setTimeoutNonBlocking(() => {
                    this.sendPingOnPrimaryIfNecessary_();
                }, Math.floor(DELAY_BEFORE_SENDING_EXTRA_REQUESTS));
            }
        }
        sendPingOnPrimaryIfNecessary_() {
            // If the connection isn't considered healthy yet, we'll send a noop ping packet request.
            if (!this.isHealthy_ && this.state_ === 1 /* RealtimeState.CONNECTED */) {
                this.log_('sending ping on primary.');
                this.sendData_({ t: 'c', d: { t: PING, d: {} } });
            }
        }
        onSecondaryConnectionLost_() {
            const conn = this.secondaryConn_;
            this.secondaryConn_ = null;
            if (this.tx_ === conn || this.rx_ === conn) {
                // we are relying on this connection already in some capacity. Therefore, a failure is real
                this.close();
            }
        }
        /**
         * @param everConnected - Whether or not the connection ever reached a server. Used to determine if
         * we should flush the host cache
         */
        onConnectionLost_(everConnected) {
            this.conn_ = null;
            // NOTE: IF you're seeing a Firefox error for this line, I think it might be because it's getting
            // called on window close and RealtimeState.CONNECTING is no longer defined.  Just a guess.
            if (!everConnected && this.state_ === 0 /* RealtimeState.CONNECTING */) {
                this.log_('Realtime connection failed.');
                // Since we failed to connect at all, clear any cached entry for this namespace in case the machine went away
                if (this.repoInfo_.isCacheableHost()) {
                    PersistentStorage.remove('host:' + this.repoInfo_.host);
                    // reset the internal host to what we would show the user, i.e. <ns>.firebaseio.com
                    this.repoInfo_.internalHost = this.repoInfo_.host;
                }
            }
            else if (this.state_ === 1 /* RealtimeState.CONNECTED */) {
                this.log_('Realtime connection lost.');
            }
            this.close();
        }
        onConnectionShutdown_(reason) {
            this.log_('Connection shutdown command received. Shutting down...');
            if (this.onKill_) {
                this.onKill_(reason);
                this.onKill_ = null;
            }
            // We intentionally don't want to fire onDisconnect (kill is a different case),
            // so clear the callback.
            this.onDisconnect_ = null;
            this.close();
        }
        sendData_(data) {
            if (this.state_ !== 1 /* RealtimeState.CONNECTED */) {
                throw 'Connection is not connected';
            }
            else {
                this.tx_.send(data);
            }
        }
        /**
         * Cleans up this connection, calling the appropriate callbacks
         */
        close() {
            if (this.state_ !== 2 /* RealtimeState.DISCONNECTED */) {
                this.log_('Closing realtime connection.');
                this.state_ = 2 /* RealtimeState.DISCONNECTED */;
                this.closeConnections_();
                if (this.onDisconnect_) {
                    this.onDisconnect_();
                    this.onDisconnect_ = null;
                }
            }
        }
        closeConnections_() {
            this.log_('Shutting down all connections');
            if (this.conn_) {
                this.conn_.close();
                this.conn_ = null;
            }
            if (this.secondaryConn_) {
                this.secondaryConn_.close();
                this.secondaryConn_ = null;
            }
            if (this.healthyTimeout_) {
                clearTimeout(this.healthyTimeout_);
                this.healthyTimeout_ = null;
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Interface defining the set of actions that can be performed against the Firebase server
     * (basically corresponds to our wire protocol).
     *
     * @interface
     */
    class ServerActions {
        put(pathString, data, onComplete, hash) { }
        merge(pathString, data, onComplete, hash) { }
        /**
         * Refreshes the auth token for the current connection.
         * @param token - The authentication token
         */
        refreshAuthToken(token) { }
        /**
         * Refreshes the app check token for the current connection.
         * @param token The app check token
         */
        refreshAppCheckToken(token) { }
        onDisconnectPut(pathString, data, onComplete) { }
        onDisconnectMerge(pathString, data, onComplete) { }
        onDisconnectCancel(pathString, onComplete) { }
        reportStats(stats) { }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Base class to be used if you want to emit events. Call the constructor with
     * the set of allowed event names.
     */
    class EventEmitter {
        constructor(allowedEvents_) {
            this.allowedEvents_ = allowedEvents_;
            this.listeners_ = {};
            assert(Array.isArray(allowedEvents_) && allowedEvents_.length > 0, 'Requires a non-empty array');
        }
        /**
         * To be called by derived classes to trigger events.
         */
        trigger(eventType, ...varArgs) {
            if (Array.isArray(this.listeners_[eventType])) {
                // Clone the list, since callbacks could add/remove listeners.
                const listeners = [...this.listeners_[eventType]];
                for (let i = 0; i < listeners.length; i++) {
                    listeners[i].callback.apply(listeners[i].context, varArgs);
                }
            }
        }
        on(eventType, callback, context) {
            this.validateEventType_(eventType);
            this.listeners_[eventType] = this.listeners_[eventType] || [];
            this.listeners_[eventType].push({ callback, context });
            const eventData = this.getInitialEvent(eventType);
            if (eventData) {
                callback.apply(context, eventData);
            }
        }
        off(eventType, callback, context) {
            this.validateEventType_(eventType);
            const listeners = this.listeners_[eventType] || [];
            for (let i = 0; i < listeners.length; i++) {
                if (listeners[i].callback === callback &&
                    (!context || context === listeners[i].context)) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        }
        validateEventType_(eventType) {
            assert(this.allowedEvents_.find(et => {
                return et === eventType;
            }), 'Unknown event: ' + eventType);
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Monitors online state (as reported by window.online/offline events).
     *
     * The expectation is that this could have many false positives (thinks we are online
     * when we're not), but no false negatives.  So we can safely use it to determine when
     * we definitely cannot reach the internet.
     */
    class OnlineMonitor extends EventEmitter {
        constructor() {
            super(['online']);
            this.online_ = true;
            // We've had repeated complaints that Cordova apps can get stuck "offline", e.g.
            // https://forum.ionicframework.com/t/firebase-connection-is-lost-and-never-come-back/43810
            // It would seem that the 'online' event does not always fire consistently. So we disable it
            // for Cordova.
            if (typeof window !== 'undefined' &&
                typeof window.addEventListener !== 'undefined' &&
                !isMobileCordova()) {
                window.addEventListener('online', () => {
                    if (!this.online_) {
                        this.online_ = true;
                        this.trigger('online', true);
                    }
                }, false);
                window.addEventListener('offline', () => {
                    if (this.online_) {
                        this.online_ = false;
                        this.trigger('online', false);
                    }
                }, false);
            }
        }
        static getInstance() {
            return new OnlineMonitor();
        }
        getInitialEvent(eventType) {
            assert(eventType === 'online', 'Unknown event type: ' + eventType);
            return [this.online_];
        }
        currentlyOnline() {
            return this.online_;
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /** Maximum key depth. */
    const MAX_PATH_DEPTH = 32;
    /** Maximum number of (UTF8) bytes in a Firebase path. */
    const MAX_PATH_LENGTH_BYTES = 768;
    /**
     * An immutable object representing a parsed path.  It's immutable so that you
     * can pass them around to other functions without worrying about them changing
     * it.
     */
    class Path {
        /**
         * @param pathOrString - Path string to parse, or another path, or the raw
         * tokens array
         */
        constructor(pathOrString, pieceNum) {
            if (pieceNum === void 0) {
                this.pieces_ = pathOrString.split('/');
                // Remove empty pieces.
                let copyTo = 0;
                for (let i = 0; i < this.pieces_.length; i++) {
                    if (this.pieces_[i].length > 0) {
                        this.pieces_[copyTo] = this.pieces_[i];
                        copyTo++;
                    }
                }
                this.pieces_.length = copyTo;
                this.pieceNum_ = 0;
            }
            else {
                this.pieces_ = pathOrString;
                this.pieceNum_ = pieceNum;
            }
        }
        toString() {
            let pathString = '';
            for (let i = this.pieceNum_; i < this.pieces_.length; i++) {
                if (this.pieces_[i] !== '') {
                    pathString += '/' + this.pieces_[i];
                }
            }
            return pathString || '/';
        }
    }
    function newEmptyPath() {
        return new Path('');
    }
    function pathGetFront(path) {
        if (path.pieceNum_ >= path.pieces_.length) {
            return null;
        }
        return path.pieces_[path.pieceNum_];
    }
    /**
     * @returns The number of segments in this path
     */
    function pathGetLength(path) {
        return path.pieces_.length - path.pieceNum_;
    }
    function pathPopFront(path) {
        let pieceNum = path.pieceNum_;
        if (pieceNum < path.pieces_.length) {
            pieceNum++;
        }
        return new Path(path.pieces_, pieceNum);
    }
    function pathGetBack(path) {
        if (path.pieceNum_ < path.pieces_.length) {
            return path.pieces_[path.pieces_.length - 1];
        }
        return null;
    }
    function pathToUrlEncodedString(path) {
        let pathString = '';
        for (let i = path.pieceNum_; i < path.pieces_.length; i++) {
            if (path.pieces_[i] !== '') {
                pathString += '/' + encodeURIComponent(String(path.pieces_[i]));
            }
        }
        return pathString || '/';
    }
    /**
     * Shallow copy of the parts of the path.
     *
     */
    function pathSlice(path, begin = 0) {
        return path.pieces_.slice(path.pieceNum_ + begin);
    }
    function pathParent(path) {
        if (path.pieceNum_ >= path.pieces_.length) {
            return null;
        }
        const pieces = [];
        for (let i = path.pieceNum_; i < path.pieces_.length - 1; i++) {
            pieces.push(path.pieces_[i]);
        }
        return new Path(pieces, 0);
    }
    function pathChild(path, childPathObj) {
        const pieces = [];
        for (let i = path.pieceNum_; i < path.pieces_.length; i++) {
            pieces.push(path.pieces_[i]);
        }
        if (childPathObj instanceof Path) {
            for (let i = childPathObj.pieceNum_; i < childPathObj.pieces_.length; i++) {
                pieces.push(childPathObj.pieces_[i]);
            }
        }
        else {
            const childPieces = childPathObj.split('/');
            for (let i = 0; i < childPieces.length; i++) {
                if (childPieces[i].length > 0) {
                    pieces.push(childPieces[i]);
                }
            }
        }
        return new Path(pieces, 0);
    }
    /**
     * @returns True if there are no segments in this path
     */
    function pathIsEmpty(path) {
        return path.pieceNum_ >= path.pieces_.length;
    }
    /**
     * @returns The path from outerPath to innerPath
     */
    function newRelativePath(outerPath, innerPath) {
        const outer = pathGetFront(outerPath), inner = pathGetFront(innerPath);
        if (outer === null) {
            return innerPath;
        }
        else if (outer === inner) {
            return newRelativePath(pathPopFront(outerPath), pathPopFront(innerPath));
        }
        else {
            throw new Error('INTERNAL ERROR: innerPath (' +
                innerPath +
                ') is not within ' +
                'outerPath (' +
                outerPath +
                ')');
        }
    }
    /**
     * @returns true if paths are the same.
     */
    function pathEquals(path, other) {
        if (pathGetLength(path) !== pathGetLength(other)) {
            return false;
        }
        for (let i = path.pieceNum_, j = other.pieceNum_; i <= path.pieces_.length; i++, j++) {
            if (path.pieces_[i] !== other.pieces_[j]) {
                return false;
            }
        }
        return true;
    }
    /**
     * @returns True if this path is a parent of (or the same as) other
     */
    function pathContains(path, other) {
        let i = path.pieceNum_;
        let j = other.pieceNum_;
        if (pathGetLength(path) > pathGetLength(other)) {
            return false;
        }
        while (i < path.pieces_.length) {
            if (path.pieces_[i] !== other.pieces_[j]) {
                return false;
            }
            ++i;
            ++j;
        }
        return true;
    }
    /**
     * Dynamic (mutable) path used to count path lengths.
     *
     * This class is used to efficiently check paths for valid
     * length (in UTF8 bytes) and depth (used in path validation).
     *
     * Throws Error exception if path is ever invalid.
     *
     * The definition of a path always begins with '/'.
     */
    class ValidationPath {
        /**
         * @param path - Initial Path.
         * @param errorPrefix_ - Prefix for any error messages.
         */
        constructor(path, errorPrefix_) {
            this.errorPrefix_ = errorPrefix_;
            this.parts_ = pathSlice(path, 0);
            /** Initialize to number of '/' chars needed in path. */
            this.byteLength_ = Math.max(1, this.parts_.length);
            for (let i = 0; i < this.parts_.length; i++) {
                this.byteLength_ += stringLength(this.parts_[i]);
            }
            validationPathCheckValid(this);
        }
    }
    function validationPathPush(validationPath, child) {
        // Count the needed '/'
        if (validationPath.parts_.length > 0) {
            validationPath.byteLength_ += 1;
        }
        validationPath.parts_.push(child);
        validationPath.byteLength_ += stringLength(child);
        validationPathCheckValid(validationPath);
    }
    function validationPathPop(validationPath) {
        const last = validationPath.parts_.pop();
        validationPath.byteLength_ -= stringLength(last);
        // Un-count the previous '/'
        if (validationPath.parts_.length > 0) {
            validationPath.byteLength_ -= 1;
        }
    }
    function validationPathCheckValid(validationPath) {
        if (validationPath.byteLength_ > MAX_PATH_LENGTH_BYTES) {
            throw new Error(validationPath.errorPrefix_ +
                'has a key path longer than ' +
                MAX_PATH_LENGTH_BYTES +
                ' bytes (' +
                validationPath.byteLength_ +
                ').');
        }
        if (validationPath.parts_.length > MAX_PATH_DEPTH) {
            throw new Error(validationPath.errorPrefix_ +
                'path specified exceeds the maximum depth that can be written (' +
                MAX_PATH_DEPTH +
                ') or object contains a cycle ' +
                validationPathToErrorString(validationPath));
        }
    }
    /**
     * String for use in error messages - uses '.' notation for path.
     */
    function validationPathToErrorString(validationPath) {
        if (validationPath.parts_.length === 0) {
            return '';
        }
        return "in property '" + validationPath.parts_.join('.') + "'";
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class VisibilityMonitor extends EventEmitter {
        constructor() {
            super(['visible']);
            let hidden;
            let visibilityChange;
            if (typeof document !== 'undefined' &&
                typeof document.addEventListener !== 'undefined') {
                if (typeof document['hidden'] !== 'undefined') {
                    // Opera 12.10 and Firefox 18 and later support
                    visibilityChange = 'visibilitychange';
                    hidden = 'hidden';
                }
                else if (typeof document['mozHidden'] !== 'undefined') {
                    visibilityChange = 'mozvisibilitychange';
                    hidden = 'mozHidden';
                }
                else if (typeof document['msHidden'] !== 'undefined') {
                    visibilityChange = 'msvisibilitychange';
                    hidden = 'msHidden';
                }
                else if (typeof document['webkitHidden'] !== 'undefined') {
                    visibilityChange = 'webkitvisibilitychange';
                    hidden = 'webkitHidden';
                }
            }
            // Initially, we always assume we are visible. This ensures that in browsers
            // without page visibility support or in cases where we are never visible
            // (e.g. chrome extension), we act as if we are visible, i.e. don't delay
            // reconnects
            this.visible_ = true;
            if (visibilityChange) {
                document.addEventListener(visibilityChange, () => {
                    const visible = !document[hidden];
                    if (visible !== this.visible_) {
                        this.visible_ = visible;
                        this.trigger('visible', visible);
                    }
                }, false);
            }
        }
        static getInstance() {
            return new VisibilityMonitor();
        }
        getInitialEvent(eventType) {
            assert(eventType === 'visible', 'Unknown event type: ' + eventType);
            return [this.visible_];
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const RECONNECT_MIN_DELAY = 1000;
    const RECONNECT_MAX_DELAY_DEFAULT = 60 * 5 * 1000; // 5 minutes in milliseconds (Case: 1858)
    const RECONNECT_MAX_DELAY_FOR_ADMINS = 30 * 1000; // 30 seconds for admin clients (likely to be a backend server)
    const RECONNECT_DELAY_MULTIPLIER = 1.3;
    const RECONNECT_DELAY_RESET_TIMEOUT = 30000; // Reset delay back to MIN_DELAY after being connected for 30sec.
    const SERVER_KILL_INTERRUPT_REASON = 'server_kill';
    // If auth fails repeatedly, we'll assume something is wrong and log a warning / back off.
    const INVALID_TOKEN_THRESHOLD = 3;
    /**
     * Firebase connection.  Abstracts wire protocol and handles reconnecting.
     *
     * NOTE: All JSON objects sent to the realtime connection must have property names enclosed
     * in quotes to make sure the closure compiler does not minify them.
     */
    class PersistentConnection extends ServerActions {
        /**
         * @param repoInfo_ - Data about the namespace we are connecting to
         * @param applicationId_ - The Firebase App ID for this project
         * @param onDataUpdate_ - A callback for new data from the server
         */
        constructor(repoInfo_, applicationId_, onDataUpdate_, onConnectStatus_, onServerInfoUpdate_, authTokenProvider_, appCheckTokenProvider_, authOverride_) {
            super();
            this.repoInfo_ = repoInfo_;
            this.applicationId_ = applicationId_;
            this.onDataUpdate_ = onDataUpdate_;
            this.onConnectStatus_ = onConnectStatus_;
            this.onServerInfoUpdate_ = onServerInfoUpdate_;
            this.authTokenProvider_ = authTokenProvider_;
            this.appCheckTokenProvider_ = appCheckTokenProvider_;
            this.authOverride_ = authOverride_;
            // Used for diagnostic logging.
            this.id = PersistentConnection.nextPersistentConnectionId_++;
            this.log_ = logWrapper('p:' + this.id + ':');
            this.interruptReasons_ = {};
            this.listens = new Map();
            this.outstandingPuts_ = [];
            this.outstandingGets_ = [];
            this.outstandingPutCount_ = 0;
            this.outstandingGetCount_ = 0;
            this.onDisconnectRequestQueue_ = [];
            this.connected_ = false;
            this.reconnectDelay_ = RECONNECT_MIN_DELAY;
            this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_DEFAULT;
            this.securityDebugCallback_ = null;
            this.lastSessionId = null;
            this.establishConnectionTimer_ = null;
            this.visible_ = false;
            // Before we get connected, we keep a queue of pending messages to send.
            this.requestCBHash_ = {};
            this.requestNumber_ = 0;
            this.realtime_ = null;
            this.authToken_ = null;
            this.appCheckToken_ = null;
            this.forceTokenRefresh_ = false;
            this.invalidAuthTokenCount_ = 0;
            this.invalidAppCheckTokenCount_ = 0;
            this.firstConnection_ = true;
            this.lastConnectionAttemptTime_ = null;
            this.lastConnectionEstablishedTime_ = null;
            if (authOverride_ && !isNodeSdk()) {
                throw new Error('Auth override specified in options, but not supported on non Node.js platforms');
            }
            VisibilityMonitor.getInstance().on('visible', this.onVisible_, this);
            if (repoInfo_.host.indexOf('fblocal') === -1) {
                OnlineMonitor.getInstance().on('online', this.onOnline_, this);
            }
        }
        sendRequest(action, body, onResponse) {
            const curReqNum = ++this.requestNumber_;
            const msg = { r: curReqNum, a: action, b: body };
            this.log_(stringify(msg));
            assert(this.connected_, "sendRequest call when we're not connected not allowed.");
            this.realtime_.sendRequest(msg);
            if (onResponse) {
                this.requestCBHash_[curReqNum] = onResponse;
            }
        }
        get(query) {
            this.initConnection_();
            const deferred = new Deferred();
            const request = {
                p: query._path.toString(),
                q: query._queryObject
            };
            const outstandingGet = {
                action: 'g',
                request,
                onComplete: (message) => {
                    const payload = message['d'];
                    if (message['s'] === 'ok') {
                        deferred.resolve(payload);
                    }
                    else {
                        deferred.reject(payload);
                    }
                }
            };
            this.outstandingGets_.push(outstandingGet);
            this.outstandingGetCount_++;
            const index = this.outstandingGets_.length - 1;
            if (this.connected_) {
                this.sendGet_(index);
            }
            return deferred.promise;
        }
        listen(query, currentHashFn, tag, onComplete) {
            this.initConnection_();
            const queryId = query._queryIdentifier;
            const pathString = query._path.toString();
            this.log_('Listen called for ' + pathString + ' ' + queryId);
            if (!this.listens.has(pathString)) {
                this.listens.set(pathString, new Map());
            }
            assert(query._queryParams.isDefault() || !query._queryParams.loadsAllData(), 'listen() called for non-default but complete query');
            assert(!this.listens.get(pathString).has(queryId), `listen() called twice for same path/queryId.`);
            const listenSpec = {
                onComplete,
                hashFn: currentHashFn,
                query,
                tag
            };
            this.listens.get(pathString).set(queryId, listenSpec);
            if (this.connected_) {
                this.sendListen_(listenSpec);
            }
        }
        sendGet_(index) {
            const get = this.outstandingGets_[index];
            this.sendRequest('g', get.request, (message) => {
                delete this.outstandingGets_[index];
                this.outstandingGetCount_--;
                if (this.outstandingGetCount_ === 0) {
                    this.outstandingGets_ = [];
                }
                if (get.onComplete) {
                    get.onComplete(message);
                }
            });
        }
        sendListen_(listenSpec) {
            const query = listenSpec.query;
            const pathString = query._path.toString();
            const queryId = query._queryIdentifier;
            this.log_('Listen on ' + pathString + ' for ' + queryId);
            const req = { /*path*/ p: pathString };
            const action = 'q';
            // Only bother to send query if it's non-default.
            if (listenSpec.tag) {
                req['q'] = query._queryObject;
                req['t'] = listenSpec.tag;
            }
            req[ /*hash*/'h'] = listenSpec.hashFn();
            this.sendRequest(action, req, (message) => {
                const payload = message[ /*data*/'d'];
                const status = message[ /*status*/'s'];
                // print warnings in any case...
                PersistentConnection.warnOnListenWarnings_(payload, query);
                const currentListenSpec = this.listens.get(pathString) &&
                    this.listens.get(pathString).get(queryId);
                // only trigger actions if the listen hasn't been removed and readded
                if (currentListenSpec === listenSpec) {
                    this.log_('listen response', message);
                    if (status !== 'ok') {
                        this.removeListen_(pathString, queryId);
                    }
                    if (listenSpec.onComplete) {
                        listenSpec.onComplete(status, payload);
                    }
                }
            });
        }
        static warnOnListenWarnings_(payload, query) {
            if (payload && typeof payload === 'object' && contains(payload, 'w')) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const warnings = safeGet(payload, 'w');
                if (Array.isArray(warnings) && ~warnings.indexOf('no_index')) {
                    const indexSpec = '".indexOn": "' + query._queryParams.getIndex().toString() + '"';
                    const indexPath = query._path.toString();
                    warn(`Using an unspecified index. Your data will be downloaded and ` +
                        `filtered on the client. Consider adding ${indexSpec} at ` +
                        `${indexPath} to your security rules for better performance.`);
                }
            }
        }
        refreshAuthToken(token) {
            this.authToken_ = token;
            this.log_('Auth token refreshed');
            if (this.authToken_) {
                this.tryAuth();
            }
            else {
                //If we're connected we want to let the server know to unauthenticate us. If we're not connected, simply delete
                //the credential so we dont become authenticated next time we connect.
                if (this.connected_) {
                    this.sendRequest('unauth', {}, () => { });
                }
            }
            this.reduceReconnectDelayIfAdminCredential_(token);
        }
        reduceReconnectDelayIfAdminCredential_(credential) {
            // NOTE: This isn't intended to be bulletproof (a malicious developer can always just modify the client).
            // Additionally, we don't bother resetting the max delay back to the default if auth fails / expires.
            const isFirebaseSecret = credential && credential.length === 40;
            if (isFirebaseSecret || isAdmin(credential)) {
                this.log_('Admin auth credential detected.  Reducing max reconnect time.');
                this.maxReconnectDelay_ = RECONNECT_MAX_DELAY_FOR_ADMINS;
            }
        }
        refreshAppCheckToken(token) {
            this.appCheckToken_ = token;
            this.log_('App check token refreshed');
            if (this.appCheckToken_) {
                this.tryAppCheck();
            }
            else {
                //If we're connected we want to let the server know to unauthenticate us.
                //If we're not connected, simply delete the credential so we dont become
                // authenticated next time we connect.
                if (this.connected_) {
                    this.sendRequest('unappeck', {}, () => { });
                }
            }
        }
        /**
         * Attempts to authenticate with the given credentials. If the authentication attempt fails, it's triggered like
         * a auth revoked (the connection is closed).
         */
        tryAuth() {
            if (this.connected_ && this.authToken_) {
                const token = this.authToken_;
                const authMethod = isValidFormat(token) ? 'auth' : 'gauth';
                const requestData = { cred: token };
                if (this.authOverride_ === null) {
                    requestData['noauth'] = true;
                }
                else if (typeof this.authOverride_ === 'object') {
                    requestData['authvar'] = this.authOverride_;
                }
                this.sendRequest(authMethod, requestData, (res) => {
                    const status = res[ /*status*/'s'];
                    const data = res[ /*data*/'d'] || 'error';
                    if (this.authToken_ === token) {
                        if (status === 'ok') {
                            this.invalidAuthTokenCount_ = 0;
                        }
                        else {
                            // Triggers reconnect and force refresh for auth token
                            this.onAuthRevoked_(status, data);
                        }
                    }
                });
            }
        }
        /**
         * Attempts to authenticate with the given token. If the authentication
         * attempt fails, it's triggered like the token was revoked (the connection is
         * closed).
         */
        tryAppCheck() {
            if (this.connected_ && this.appCheckToken_) {
                this.sendRequest('appcheck', { 'token': this.appCheckToken_ }, (res) => {
                    const status = res[ /*status*/'s'];
                    const data = res[ /*data*/'d'] || 'error';
                    if (status === 'ok') {
                        this.invalidAppCheckTokenCount_ = 0;
                    }
                    else {
                        this.onAppCheckRevoked_(status, data);
                    }
                });
            }
        }
        /**
         * @inheritDoc
         */
        unlisten(query, tag) {
            const pathString = query._path.toString();
            const queryId = query._queryIdentifier;
            this.log_('Unlisten called for ' + pathString + ' ' + queryId);
            assert(query._queryParams.isDefault() || !query._queryParams.loadsAllData(), 'unlisten() called for non-default but complete query');
            const listen = this.removeListen_(pathString, queryId);
            if (listen && this.connected_) {
                this.sendUnlisten_(pathString, queryId, query._queryObject, tag);
            }
        }
        sendUnlisten_(pathString, queryId, queryObj, tag) {
            this.log_('Unlisten on ' + pathString + ' for ' + queryId);
            const req = { /*path*/ p: pathString };
            const action = 'n';
            // Only bother sending queryId if it's non-default.
            if (tag) {
                req['q'] = queryObj;
                req['t'] = tag;
            }
            this.sendRequest(action, req);
        }
        onDisconnectPut(pathString, data, onComplete) {
            this.initConnection_();
            if (this.connected_) {
                this.sendOnDisconnect_('o', pathString, data, onComplete);
            }
            else {
                this.onDisconnectRequestQueue_.push({
                    pathString,
                    action: 'o',
                    data,
                    onComplete
                });
            }
        }
        onDisconnectMerge(pathString, data, onComplete) {
            this.initConnection_();
            if (this.connected_) {
                this.sendOnDisconnect_('om', pathString, data, onComplete);
            }
            else {
                this.onDisconnectRequestQueue_.push({
                    pathString,
                    action: 'om',
                    data,
                    onComplete
                });
            }
        }
        onDisconnectCancel(pathString, onComplete) {
            this.initConnection_();
            if (this.connected_) {
                this.sendOnDisconnect_('oc', pathString, null, onComplete);
            }
            else {
                this.onDisconnectRequestQueue_.push({
                    pathString,
                    action: 'oc',
                    data: null,
                    onComplete
                });
            }
        }
        sendOnDisconnect_(action, pathString, data, onComplete) {
            const request = { /*path*/ p: pathString, /*data*/ d: data };
            this.log_('onDisconnect ' + action, request);
            this.sendRequest(action, request, (response) => {
                if (onComplete) {
                    setTimeout(() => {
                        onComplete(response[ /*status*/'s'], response[ /* data */'d']);
                    }, Math.floor(0));
                }
            });
        }
        put(pathString, data, onComplete, hash) {
            this.putInternal('p', pathString, data, onComplete, hash);
        }
        merge(pathString, data, onComplete, hash) {
            this.putInternal('m', pathString, data, onComplete, hash);
        }
        putInternal(action, pathString, data, onComplete, hash) {
            this.initConnection_();
            const request = {
                /*path*/ p: pathString,
                /*data*/ d: data
            };
            if (hash !== undefined) {
                request[ /*hash*/'h'] = hash;
            }
            // TODO: Only keep track of the most recent put for a given path?
            this.outstandingPuts_.push({
                action,
                request,
                onComplete
            });
            this.outstandingPutCount_++;
            const index = this.outstandingPuts_.length - 1;
            if (this.connected_) {
                this.sendPut_(index);
            }
            else {
                this.log_('Buffering put: ' + pathString);
            }
        }
        sendPut_(index) {
            const action = this.outstandingPuts_[index].action;
            const request = this.outstandingPuts_[index].request;
            const onComplete = this.outstandingPuts_[index].onComplete;
            this.outstandingPuts_[index].queued = this.connected_;
            this.sendRequest(action, request, (message) => {
                this.log_(action + ' response', message);
                delete this.outstandingPuts_[index];
                this.outstandingPutCount_--;
                // Clean up array occasionally.
                if (this.outstandingPutCount_ === 0) {
                    this.outstandingPuts_ = [];
                }
                if (onComplete) {
                    onComplete(message[ /*status*/'s'], message[ /* data */'d']);
                }
            });
        }
        reportStats(stats) {
            // If we're not connected, we just drop the stats.
            if (this.connected_) {
                const request = { /*counters*/ c: stats };
                this.log_('reportStats', request);
                this.sendRequest(/*stats*/ 's', request, result => {
                    const status = result[ /*status*/'s'];
                    if (status !== 'ok') {
                        const errorReason = result[ /* data */'d'];
                        this.log_('reportStats', 'Error sending stats: ' + errorReason);
                    }
                });
            }
        }
        onDataMessage_(message) {
            if ('r' in message) {
                // this is a response
                this.log_('from server: ' + stringify(message));
                const reqNum = message['r'];
                const onResponse = this.requestCBHash_[reqNum];
                if (onResponse) {
                    delete this.requestCBHash_[reqNum];
                    onResponse(message[ /*body*/'b']);
                }
            }
            else if ('error' in message) {
                throw 'A server-side error has occurred: ' + message['error'];
            }
            else if ('a' in message) {
                // a and b are action and body, respectively
                this.onDataPush_(message['a'], message['b']);
            }
        }
        onDataPush_(action, body) {
            this.log_('handleServerMessage', action, body);
            if (action === 'd') {
                this.onDataUpdate_(body[ /*path*/'p'], body[ /*data*/'d'], 
                /*isMerge*/ false, body['t']);
            }
            else if (action === 'm') {
                this.onDataUpdate_(body[ /*path*/'p'], body[ /*data*/'d'], 
                /*isMerge=*/ true, body['t']);
            }
            else if (action === 'c') {
                this.onListenRevoked_(body[ /*path*/'p'], body[ /*query*/'q']);
            }
            else if (action === 'ac') {
                this.onAuthRevoked_(body[ /*status code*/'s'], body[ /* explanation */'d']);
            }
            else if (action === 'apc') {
                this.onAppCheckRevoked_(body[ /*status code*/'s'], body[ /* explanation */'d']);
            }
            else if (action === 'sd') {
                this.onSecurityDebugPacket_(body);
            }
            else {
                error('Unrecognized action received from server: ' +
                    stringify(action) +
                    '\nAre you using the latest client?');
            }
        }
        onReady_(timestamp, sessionId) {
            this.log_('connection ready');
            this.connected_ = true;
            this.lastConnectionEstablishedTime_ = new Date().getTime();
            this.handleTimestamp_(timestamp);
            this.lastSessionId = sessionId;
            if (this.firstConnection_) {
                this.sendConnectStats_();
            }
            this.restoreState_();
            this.firstConnection_ = false;
            this.onConnectStatus_(true);
        }
        scheduleConnect_(timeout) {
            assert(!this.realtime_, "Scheduling a connect when we're already connected/ing?");
            if (this.establishConnectionTimer_) {
                clearTimeout(this.establishConnectionTimer_);
            }
            // NOTE: Even when timeout is 0, it's important to do a setTimeout to work around an infuriating "Security Error" in
            // Firefox when trying to write to our long-polling iframe in some scenarios (e.g. Forge or our unit tests).
            this.establishConnectionTimer_ = setTimeout(() => {
                this.establishConnectionTimer_ = null;
                this.establishConnection_();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }, Math.floor(timeout));
        }
        initConnection_() {
            if (!this.realtime_ && this.firstConnection_) {
                this.scheduleConnect_(0);
            }
        }
        onVisible_(visible) {
            // NOTE: Tabbing away and back to a window will defeat our reconnect backoff, but I think that's fine.
            if (visible &&
                !this.visible_ &&
                this.reconnectDelay_ === this.maxReconnectDelay_) {
                this.log_('Window became visible.  Reducing delay.');
                this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                if (!this.realtime_) {
                    this.scheduleConnect_(0);
                }
            }
            this.visible_ = visible;
        }
        onOnline_(online) {
            if (online) {
                this.log_('Browser went online.');
                this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                if (!this.realtime_) {
                    this.scheduleConnect_(0);
                }
            }
            else {
                this.log_('Browser went offline.  Killing connection.');
                if (this.realtime_) {
                    this.realtime_.close();
                }
            }
        }
        onRealtimeDisconnect_() {
            this.log_('data client disconnected');
            this.connected_ = false;
            this.realtime_ = null;
            // Since we don't know if our sent transactions succeeded or not, we need to cancel them.
            this.cancelSentTransactions_();
            // Clear out the pending requests.
            this.requestCBHash_ = {};
            if (this.shouldReconnect_()) {
                if (!this.visible_) {
                    this.log_("Window isn't visible.  Delaying reconnect.");
                    this.reconnectDelay_ = this.maxReconnectDelay_;
                    this.lastConnectionAttemptTime_ = new Date().getTime();
                }
                else if (this.lastConnectionEstablishedTime_) {
                    // If we've been connected long enough, reset reconnect delay to minimum.
                    const timeSinceLastConnectSucceeded = new Date().getTime() - this.lastConnectionEstablishedTime_;
                    if (timeSinceLastConnectSucceeded > RECONNECT_DELAY_RESET_TIMEOUT) {
                        this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                    }
                    this.lastConnectionEstablishedTime_ = null;
                }
                const timeSinceLastConnectAttempt = new Date().getTime() - this.lastConnectionAttemptTime_;
                let reconnectDelay = Math.max(0, this.reconnectDelay_ - timeSinceLastConnectAttempt);
                reconnectDelay = Math.random() * reconnectDelay;
                this.log_('Trying to reconnect in ' + reconnectDelay + 'ms');
                this.scheduleConnect_(reconnectDelay);
                // Adjust reconnect delay for next time.
                this.reconnectDelay_ = Math.min(this.maxReconnectDelay_, this.reconnectDelay_ * RECONNECT_DELAY_MULTIPLIER);
            }
            this.onConnectStatus_(false);
        }
        async establishConnection_() {
            if (this.shouldReconnect_()) {
                this.log_('Making a connection attempt');
                this.lastConnectionAttemptTime_ = new Date().getTime();
                this.lastConnectionEstablishedTime_ = null;
                const onDataMessage = this.onDataMessage_.bind(this);
                const onReady = this.onReady_.bind(this);
                const onDisconnect = this.onRealtimeDisconnect_.bind(this);
                const connId = this.id + ':' + PersistentConnection.nextConnectionId_++;
                const lastSessionId = this.lastSessionId;
                let canceled = false;
                let connection = null;
                const closeFn = function () {
                    if (connection) {
                        connection.close();
                    }
                    else {
                        canceled = true;
                        onDisconnect();
                    }
                };
                const sendRequestFn = function (msg) {
                    assert(connection, "sendRequest call when we're not connected not allowed.");
                    connection.sendRequest(msg);
                };
                this.realtime_ = {
                    close: closeFn,
                    sendRequest: sendRequestFn
                };
                const forceRefresh = this.forceTokenRefresh_;
                this.forceTokenRefresh_ = false;
                try {
                    // First fetch auth and app check token, and establish connection after
                    // fetching the token was successful
                    const [authToken, appCheckToken] = await Promise.all([
                        this.authTokenProvider_.getToken(forceRefresh),
                        this.appCheckTokenProvider_.getToken(forceRefresh)
                    ]);
                    if (!canceled) {
                        log('getToken() completed. Creating connection.');
                        this.authToken_ = authToken && authToken.accessToken;
                        this.appCheckToken_ = appCheckToken && appCheckToken.token;
                        connection = new Connection(connId, this.repoInfo_, this.applicationId_, this.appCheckToken_, this.authToken_, onDataMessage, onReady, onDisconnect, 
                        /* onKill= */ reason => {
                            warn(reason + ' (' + this.repoInfo_.toString() + ')');
                            this.interrupt(SERVER_KILL_INTERRUPT_REASON);
                        }, lastSessionId);
                    }
                    else {
                        log('getToken() completed but was canceled');
                    }
                }
                catch (error) {
                    this.log_('Failed to get token: ' + error);
                    if (!canceled) {
                        if (this.repoInfo_.nodeAdmin) {
                            // This may be a critical error for the Admin Node.js SDK, so log a warning.
                            // But getToken() may also just have temporarily failed, so we still want to
                            // continue retrying.
                            warn(error);
                        }
                        closeFn();
                    }
                }
            }
        }
        interrupt(reason) {
            log('Interrupting connection for reason: ' + reason);
            this.interruptReasons_[reason] = true;
            if (this.realtime_) {
                this.realtime_.close();
            }
            else {
                if (this.establishConnectionTimer_) {
                    clearTimeout(this.establishConnectionTimer_);
                    this.establishConnectionTimer_ = null;
                }
                if (this.connected_) {
                    this.onRealtimeDisconnect_();
                }
            }
        }
        resume(reason) {
            log('Resuming connection for reason: ' + reason);
            delete this.interruptReasons_[reason];
            if (isEmpty(this.interruptReasons_)) {
                this.reconnectDelay_ = RECONNECT_MIN_DELAY;
                if (!this.realtime_) {
                    this.scheduleConnect_(0);
                }
            }
        }
        handleTimestamp_(timestamp) {
            const delta = timestamp - new Date().getTime();
            this.onServerInfoUpdate_({ serverTimeOffset: delta });
        }
        cancelSentTransactions_() {
            for (let i = 0; i < this.outstandingPuts_.length; i++) {
                const put = this.outstandingPuts_[i];
                if (put && /*hash*/ 'h' in put.request && put.queued) {
                    if (put.onComplete) {
                        put.onComplete('disconnect');
                    }
                    delete this.outstandingPuts_[i];
                    this.outstandingPutCount_--;
                }
            }
            // Clean up array occasionally.
            if (this.outstandingPutCount_ === 0) {
                this.outstandingPuts_ = [];
            }
        }
        onListenRevoked_(pathString, query) {
            // Remove the listen and manufacture a "permission_denied" error for the failed listen.
            let queryId;
            if (!query) {
                queryId = 'default';
            }
            else {
                queryId = query.map(q => ObjectToUniqueKey(q)).join('$');
            }
            const listen = this.removeListen_(pathString, queryId);
            if (listen && listen.onComplete) {
                listen.onComplete('permission_denied');
            }
        }
        removeListen_(pathString, queryId) {
            const normalizedPathString = new Path(pathString).toString(); // normalize path.
            let listen;
            if (this.listens.has(normalizedPathString)) {
                const map = this.listens.get(normalizedPathString);
                listen = map.get(queryId);
                map.delete(queryId);
                if (map.size === 0) {
                    this.listens.delete(normalizedPathString);
                }
            }
            else {
                // all listens for this path has already been removed
                listen = undefined;
            }
            return listen;
        }
        onAuthRevoked_(statusCode, explanation) {
            log('Auth token revoked: ' + statusCode + '/' + explanation);
            this.authToken_ = null;
            this.forceTokenRefresh_ = true;
            this.realtime_.close();
            if (statusCode === 'invalid_token' || statusCode === 'permission_denied') {
                // We'll wait a couple times before logging the warning / increasing the
                // retry period since oauth tokens will report as "invalid" if they're
                // just expired. Plus there may be transient issues that resolve themselves.
                this.invalidAuthTokenCount_++;
                if (this.invalidAuthTokenCount_ >= INVALID_TOKEN_THRESHOLD) {
                    // Set a long reconnect delay because recovery is unlikely
                    this.reconnectDelay_ = RECONNECT_MAX_DELAY_FOR_ADMINS;
                    // Notify the auth token provider that the token is invalid, which will log
                    // a warning
                    this.authTokenProvider_.notifyForInvalidToken();
                }
            }
        }
        onAppCheckRevoked_(statusCode, explanation) {
            log('App check token revoked: ' + statusCode + '/' + explanation);
            this.appCheckToken_ = null;
            this.forceTokenRefresh_ = true;
            // Note: We don't close the connection as the developer may not have
            // enforcement enabled. The backend closes connections with enforcements.
            if (statusCode === 'invalid_token' || statusCode === 'permission_denied') {
                // We'll wait a couple times before logging the warning / increasing the
                // retry period since oauth tokens will report as "invalid" if they're
                // just expired. Plus there may be transient issues that resolve themselves.
                this.invalidAppCheckTokenCount_++;
                if (this.invalidAppCheckTokenCount_ >= INVALID_TOKEN_THRESHOLD) {
                    this.appCheckTokenProvider_.notifyForInvalidToken();
                }
            }
        }
        onSecurityDebugPacket_(body) {
            if (this.securityDebugCallback_) {
                this.securityDebugCallback_(body);
            }
            else {
                if ('msg' in body) {
                    console.log('FIREBASE: ' + body['msg'].replace('\n', '\nFIREBASE: '));
                }
            }
        }
        restoreState_() {
            //Re-authenticate ourselves if we have a credential stored.
            this.tryAuth();
            this.tryAppCheck();
            // Puts depend on having received the corresponding data update from the server before they complete, so we must
            // make sure to send listens before puts.
            for (const queries of this.listens.values()) {
                for (const listenSpec of queries.values()) {
                    this.sendListen_(listenSpec);
                }
            }
            for (let i = 0; i < this.outstandingPuts_.length; i++) {
                if (this.outstandingPuts_[i]) {
                    this.sendPut_(i);
                }
            }
            while (this.onDisconnectRequestQueue_.length) {
                const request = this.onDisconnectRequestQueue_.shift();
                this.sendOnDisconnect_(request.action, request.pathString, request.data, request.onComplete);
            }
            for (let i = 0; i < this.outstandingGets_.length; i++) {
                if (this.outstandingGets_[i]) {
                    this.sendGet_(i);
                }
            }
        }
        /**
         * Sends client stats for first connection
         */
        sendConnectStats_() {
            const stats = {};
            let clientName = 'js';
            stats['sdk.' + clientName + '.' + SDK_VERSION.replace(/\./g, '-')] = 1;
            if (isMobileCordova()) {
                stats['framework.cordova'] = 1;
            }
            else if (isReactNative()) {
                stats['framework.reactnative'] = 1;
            }
            this.reportStats(stats);
        }
        shouldReconnect_() {
            const online = OnlineMonitor.getInstance().currentlyOnline();
            return isEmpty(this.interruptReasons_) && online;
        }
    }
    PersistentConnection.nextPersistentConnectionId_ = 0;
    /**
     * Counter for number of connections created. Mainly used for tagging in the logs
     */
    PersistentConnection.nextConnectionId_ = 0;

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class NamedNode {
        constructor(name, node) {
            this.name = name;
            this.node = node;
        }
        static Wrap(name, node) {
            return new NamedNode(name, node);
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class Index {
        /**
         * @returns A standalone comparison function for
         * this index
         */
        getCompare() {
            return this.compare.bind(this);
        }
        /**
         * Given a before and after value for a node, determine if the indexed value has changed. Even if they are different,
         * it's possible that the changes are isolated to parts of the snapshot that are not indexed.
         *
         *
         * @returns True if the portion of the snapshot being indexed changed between oldNode and newNode
         */
        indexedValueChanged(oldNode, newNode) {
            const oldWrapped = new NamedNode(MIN_NAME, oldNode);
            const newWrapped = new NamedNode(MIN_NAME, newNode);
            return this.compare(oldWrapped, newWrapped) !== 0;
        }
        /**
         * @returns a node wrapper that will sort equal to or less than
         * any other node wrapper, using this index
         */
        minPost() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NamedNode.MIN;
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let __EMPTY_NODE;
    class KeyIndex extends Index {
        static get __EMPTY_NODE() {
            return __EMPTY_NODE;
        }
        static set __EMPTY_NODE(val) {
            __EMPTY_NODE = val;
        }
        compare(a, b) {
            return nameCompare(a.name, b.name);
        }
        isDefinedOn(node) {
            // We could probably return true here (since every node has a key), but it's never called
            // so just leaving unimplemented for now.
            throw assertionError('KeyIndex.isDefinedOn not expected to be called.');
        }
        indexedValueChanged(oldNode, newNode) {
            return false; // The key for a node never changes.
        }
        minPost() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NamedNode.MIN;
        }
        maxPost() {
            // TODO: This should really be created once and cached in a static property, but
            // NamedNode isn't defined yet, so I can't use it in a static.  Bleh.
            return new NamedNode(MAX_NAME, __EMPTY_NODE);
        }
        makePost(indexValue, name) {
            assert(typeof indexValue === 'string', 'KeyIndex indexValue must always be a string.');
            // We just use empty node, but it'll never be compared, since our comparator only looks at name.
            return new NamedNode(indexValue, __EMPTY_NODE);
        }
        /**
         * @returns String representation for inclusion in a query spec
         */
        toString() {
            return '.key';
        }
    }
    const KEY_INDEX = new KeyIndex();

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * An iterator over an LLRBNode.
     */
    class SortedMapIterator {
        /**
         * @param node - Node to iterate.
         * @param isReverse_ - Whether or not to iterate in reverse
         */
        constructor(node, startKey, comparator, isReverse_, resultGenerator_ = null) {
            this.isReverse_ = isReverse_;
            this.resultGenerator_ = resultGenerator_;
            this.nodeStack_ = [];
            let cmp = 1;
            while (!node.isEmpty()) {
                node = node;
                cmp = startKey ? comparator(node.key, startKey) : 1;
                // flip the comparison if we're going in reverse
                if (isReverse_) {
                    cmp *= -1;
                }
                if (cmp < 0) {
                    // This node is less than our start key. ignore it
                    if (this.isReverse_) {
                        node = node.left;
                    }
                    else {
                        node = node.right;
                    }
                }
                else if (cmp === 0) {
                    // This node is exactly equal to our start key. Push it on the stack, but stop iterating;
                    this.nodeStack_.push(node);
                    break;
                }
                else {
                    // This node is greater than our start key, add it to the stack and move to the next one
                    this.nodeStack_.push(node);
                    if (this.isReverse_) {
                        node = node.right;
                    }
                    else {
                        node = node.left;
                    }
                }
            }
        }
        getNext() {
            if (this.nodeStack_.length === 0) {
                return null;
            }
            let node = this.nodeStack_.pop();
            let result;
            if (this.resultGenerator_) {
                result = this.resultGenerator_(node.key, node.value);
            }
            else {
                result = { key: node.key, value: node.value };
            }
            if (this.isReverse_) {
                node = node.left;
                while (!node.isEmpty()) {
                    this.nodeStack_.push(node);
                    node = node.right;
                }
            }
            else {
                node = node.right;
                while (!node.isEmpty()) {
                    this.nodeStack_.push(node);
                    node = node.left;
                }
            }
            return result;
        }
        hasNext() {
            return this.nodeStack_.length > 0;
        }
        peek() {
            if (this.nodeStack_.length === 0) {
                return null;
            }
            const node = this.nodeStack_[this.nodeStack_.length - 1];
            if (this.resultGenerator_) {
                return this.resultGenerator_(node.key, node.value);
            }
            else {
                return { key: node.key, value: node.value };
            }
        }
    }
    /**
     * Represents a node in a Left-leaning Red-Black tree.
     */
    class LLRBNode {
        /**
         * @param key - Key associated with this node.
         * @param value - Value associated with this node.
         * @param color - Whether this node is red.
         * @param left - Left child.
         * @param right - Right child.
         */
        constructor(key, value, color, left, right) {
            this.key = key;
            this.value = value;
            this.color = color != null ? color : LLRBNode.RED;
            this.left =
                left != null ? left : SortedMap.EMPTY_NODE;
            this.right =
                right != null ? right : SortedMap.EMPTY_NODE;
        }
        /**
         * Returns a copy of the current node, optionally replacing pieces of it.
         *
         * @param key - New key for the node, or null.
         * @param value - New value for the node, or null.
         * @param color - New color for the node, or null.
         * @param left - New left child for the node, or null.
         * @param right - New right child for the node, or null.
         * @returns The node copy.
         */
        copy(key, value, color, left, right) {
            return new LLRBNode(key != null ? key : this.key, value != null ? value : this.value, color != null ? color : this.color, left != null ? left : this.left, right != null ? right : this.right);
        }
        /**
         * @returns The total number of nodes in the tree.
         */
        count() {
            return this.left.count() + 1 + this.right.count();
        }
        /**
         * @returns True if the tree is empty.
         */
        isEmpty() {
            return false;
        }
        /**
         * Traverses the tree in key order and calls the specified action function
         * for each node.
         *
         * @param action - Callback function to be called for each
         *   node.  If it returns true, traversal is aborted.
         * @returns The first truthy value returned by action, or the last falsey
         *   value returned by action
         */
        inorderTraversal(action) {
            return (this.left.inorderTraversal(action) ||
                !!action(this.key, this.value) ||
                this.right.inorderTraversal(action));
        }
        /**
         * Traverses the tree in reverse key order and calls the specified action function
         * for each node.
         *
         * @param action - Callback function to be called for each
         * node.  If it returns true, traversal is aborted.
         * @returns True if traversal was aborted.
         */
        reverseTraversal(action) {
            return (this.right.reverseTraversal(action) ||
                action(this.key, this.value) ||
                this.left.reverseTraversal(action));
        }
        /**
         * @returns The minimum node in the tree.
         */
        min_() {
            if (this.left.isEmpty()) {
                return this;
            }
            else {
                return this.left.min_();
            }
        }
        /**
         * @returns The maximum key in the tree.
         */
        minKey() {
            return this.min_().key;
        }
        /**
         * @returns The maximum key in the tree.
         */
        maxKey() {
            if (this.right.isEmpty()) {
                return this.key;
            }
            else {
                return this.right.maxKey();
            }
        }
        /**
         * @param key - Key to insert.
         * @param value - Value to insert.
         * @param comparator - Comparator.
         * @returns New tree, with the key/value added.
         */
        insert(key, value, comparator) {
            let n = this;
            const cmp = comparator(key, n.key);
            if (cmp < 0) {
                n = n.copy(null, null, null, n.left.insert(key, value, comparator), null);
            }
            else if (cmp === 0) {
                n = n.copy(null, value, null, null, null);
            }
            else {
                n = n.copy(null, null, null, null, n.right.insert(key, value, comparator));
            }
            return n.fixUp_();
        }
        /**
         * @returns New tree, with the minimum key removed.
         */
        removeMin_() {
            if (this.left.isEmpty()) {
                return SortedMap.EMPTY_NODE;
            }
            let n = this;
            if (!n.left.isRed_() && !n.left.left.isRed_()) {
                n = n.moveRedLeft_();
            }
            n = n.copy(null, null, null, n.left.removeMin_(), null);
            return n.fixUp_();
        }
        /**
         * @param key - The key of the item to remove.
         * @param comparator - Comparator.
         * @returns New tree, with the specified item removed.
         */
        remove(key, comparator) {
            let n, smallest;
            n = this;
            if (comparator(key, n.key) < 0) {
                if (!n.left.isEmpty() && !n.left.isRed_() && !n.left.left.isRed_()) {
                    n = n.moveRedLeft_();
                }
                n = n.copy(null, null, null, n.left.remove(key, comparator), null);
            }
            else {
                if (n.left.isRed_()) {
                    n = n.rotateRight_();
                }
                if (!n.right.isEmpty() && !n.right.isRed_() && !n.right.left.isRed_()) {
                    n = n.moveRedRight_();
                }
                if (comparator(key, n.key) === 0) {
                    if (n.right.isEmpty()) {
                        return SortedMap.EMPTY_NODE;
                    }
                    else {
                        smallest = n.right.min_();
                        n = n.copy(smallest.key, smallest.value, null, null, n.right.removeMin_());
                    }
                }
                n = n.copy(null, null, null, null, n.right.remove(key, comparator));
            }
            return n.fixUp_();
        }
        /**
         * @returns Whether this is a RED node.
         */
        isRed_() {
            return this.color;
        }
        /**
         * @returns New tree after performing any needed rotations.
         */
        fixUp_() {
            let n = this;
            if (n.right.isRed_() && !n.left.isRed_()) {
                n = n.rotateLeft_();
            }
            if (n.left.isRed_() && n.left.left.isRed_()) {
                n = n.rotateRight_();
            }
            if (n.left.isRed_() && n.right.isRed_()) {
                n = n.colorFlip_();
            }
            return n;
        }
        /**
         * @returns New tree, after moveRedLeft.
         */
        moveRedLeft_() {
            let n = this.colorFlip_();
            if (n.right.left.isRed_()) {
                n = n.copy(null, null, null, null, n.right.rotateRight_());
                n = n.rotateLeft_();
                n = n.colorFlip_();
            }
            return n;
        }
        /**
         * @returns New tree, after moveRedRight.
         */
        moveRedRight_() {
            let n = this.colorFlip_();
            if (n.left.left.isRed_()) {
                n = n.rotateRight_();
                n = n.colorFlip_();
            }
            return n;
        }
        /**
         * @returns New tree, after rotateLeft.
         */
        rotateLeft_() {
            const nl = this.copy(null, null, LLRBNode.RED, null, this.right.left);
            return this.right.copy(null, null, this.color, nl, null);
        }
        /**
         * @returns New tree, after rotateRight.
         */
        rotateRight_() {
            const nr = this.copy(null, null, LLRBNode.RED, this.left.right, null);
            return this.left.copy(null, null, this.color, null, nr);
        }
        /**
         * @returns Newt ree, after colorFlip.
         */
        colorFlip_() {
            const left = this.left.copy(null, null, !this.left.color, null, null);
            const right = this.right.copy(null, null, !this.right.color, null, null);
            return this.copy(null, null, !this.color, left, right);
        }
        /**
         * For testing.
         *
         * @returns True if all is well.
         */
        checkMaxDepth_() {
            const blackDepth = this.check_();
            return Math.pow(2.0, blackDepth) <= this.count() + 1;
        }
        check_() {
            if (this.isRed_() && this.left.isRed_()) {
                throw new Error('Red node has red child(' + this.key + ',' + this.value + ')');
            }
            if (this.right.isRed_()) {
                throw new Error('Right child of (' + this.key + ',' + this.value + ') is red');
            }
            const blackDepth = this.left.check_();
            if (blackDepth !== this.right.check_()) {
                throw new Error('Black depths differ');
            }
            else {
                return blackDepth + (this.isRed_() ? 0 : 1);
            }
        }
    }
    LLRBNode.RED = true;
    LLRBNode.BLACK = false;
    /**
     * Represents an empty node (a leaf node in the Red-Black Tree).
     */
    class LLRBEmptyNode {
        /**
         * Returns a copy of the current node.
         *
         * @returns The node copy.
         */
        copy(key, value, color, left, right) {
            return this;
        }
        /**
         * Returns a copy of the tree, with the specified key/value added.
         *
         * @param key - Key to be added.
         * @param value - Value to be added.
         * @param comparator - Comparator.
         * @returns New tree, with item added.
         */
        insert(key, value, comparator) {
            return new LLRBNode(key, value, null);
        }
        /**
         * Returns a copy of the tree, with the specified key removed.
         *
         * @param key - The key to remove.
         * @param comparator - Comparator.
         * @returns New tree, with item removed.
         */
        remove(key, comparator) {
            return this;
        }
        /**
         * @returns The total number of nodes in the tree.
         */
        count() {
            return 0;
        }
        /**
         * @returns True if the tree is empty.
         */
        isEmpty() {
            return true;
        }
        /**
         * Traverses the tree in key order and calls the specified action function
         * for each node.
         *
         * @param action - Callback function to be called for each
         * node.  If it returns true, traversal is aborted.
         * @returns True if traversal was aborted.
         */
        inorderTraversal(action) {
            return false;
        }
        /**
         * Traverses the tree in reverse key order and calls the specified action function
         * for each node.
         *
         * @param action - Callback function to be called for each
         * node.  If it returns true, traversal is aborted.
         * @returns True if traversal was aborted.
         */
        reverseTraversal(action) {
            return false;
        }
        minKey() {
            return null;
        }
        maxKey() {
            return null;
        }
        check_() {
            return 0;
        }
        /**
         * @returns Whether this node is red.
         */
        isRed_() {
            return false;
        }
    }
    /**
     * An immutable sorted map implementation, based on a Left-leaning Red-Black
     * tree.
     */
    class SortedMap {
        /**
         * @param comparator_ - Key comparator.
         * @param root_ - Optional root node for the map.
         */
        constructor(comparator_, root_ = SortedMap.EMPTY_NODE) {
            this.comparator_ = comparator_;
            this.root_ = root_;
        }
        /**
         * Returns a copy of the map, with the specified key/value added or replaced.
         * (TODO: We should perhaps rename this method to 'put')
         *
         * @param key - Key to be added.
         * @param value - Value to be added.
         * @returns New map, with item added.
         */
        insert(key, value) {
            return new SortedMap(this.comparator_, this.root_
                .insert(key, value, this.comparator_)
                .copy(null, null, LLRBNode.BLACK, null, null));
        }
        /**
         * Returns a copy of the map, with the specified key removed.
         *
         * @param key - The key to remove.
         * @returns New map, with item removed.
         */
        remove(key) {
            return new SortedMap(this.comparator_, this.root_
                .remove(key, this.comparator_)
                .copy(null, null, LLRBNode.BLACK, null, null));
        }
        /**
         * Returns the value of the node with the given key, or null.
         *
         * @param key - The key to look up.
         * @returns The value of the node with the given key, or null if the
         * key doesn't exist.
         */
        get(key) {
            let cmp;
            let node = this.root_;
            while (!node.isEmpty()) {
                cmp = this.comparator_(key, node.key);
                if (cmp === 0) {
                    return node.value;
                }
                else if (cmp < 0) {
                    node = node.left;
                }
                else if (cmp > 0) {
                    node = node.right;
                }
            }
            return null;
        }
        /**
         * Returns the key of the item *before* the specified key, or null if key is the first item.
         * @param key - The key to find the predecessor of
         * @returns The predecessor key.
         */
        getPredecessorKey(key) {
            let cmp, node = this.root_, rightParent = null;
            while (!node.isEmpty()) {
                cmp = this.comparator_(key, node.key);
                if (cmp === 0) {
                    if (!node.left.isEmpty()) {
                        node = node.left;
                        while (!node.right.isEmpty()) {
                            node = node.right;
                        }
                        return node.key;
                    }
                    else if (rightParent) {
                        return rightParent.key;
                    }
                    else {
                        return null; // first item.
                    }
                }
                else if (cmp < 0) {
                    node = node.left;
                }
                else if (cmp > 0) {
                    rightParent = node;
                    node = node.right;
                }
            }
            throw new Error('Attempted to find predecessor key for a nonexistent key.  What gives?');
        }
        /**
         * @returns True if the map is empty.
         */
        isEmpty() {
            return this.root_.isEmpty();
        }
        /**
         * @returns The total number of nodes in the map.
         */
        count() {
            return this.root_.count();
        }
        /**
         * @returns The minimum key in the map.
         */
        minKey() {
            return this.root_.minKey();
        }
        /**
         * @returns The maximum key in the map.
         */
        maxKey() {
            return this.root_.maxKey();
        }
        /**
         * Traverses the map in key order and calls the specified action function
         * for each key/value pair.
         *
         * @param action - Callback function to be called
         * for each key/value pair.  If action returns true, traversal is aborted.
         * @returns The first truthy value returned by action, or the last falsey
         *   value returned by action
         */
        inorderTraversal(action) {
            return this.root_.inorderTraversal(action);
        }
        /**
         * Traverses the map in reverse key order and calls the specified action function
         * for each key/value pair.
         *
         * @param action - Callback function to be called
         * for each key/value pair.  If action returns true, traversal is aborted.
         * @returns True if the traversal was aborted.
         */
        reverseTraversal(action) {
            return this.root_.reverseTraversal(action);
        }
        /**
         * Returns an iterator over the SortedMap.
         * @returns The iterator.
         */
        getIterator(resultGenerator) {
            return new SortedMapIterator(this.root_, null, this.comparator_, false, resultGenerator);
        }
        getIteratorFrom(key, resultGenerator) {
            return new SortedMapIterator(this.root_, key, this.comparator_, false, resultGenerator);
        }
        getReverseIteratorFrom(key, resultGenerator) {
            return new SortedMapIterator(this.root_, key, this.comparator_, true, resultGenerator);
        }
        getReverseIterator(resultGenerator) {
            return new SortedMapIterator(this.root_, null, this.comparator_, true, resultGenerator);
        }
    }
    /**
     * Always use the same empty node, to reduce memory.
     */
    SortedMap.EMPTY_NODE = new LLRBEmptyNode();

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function NAME_ONLY_COMPARATOR(left, right) {
        return nameCompare(left.name, right.name);
    }
    function NAME_COMPARATOR(left, right) {
        return nameCompare(left, right);
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let MAX_NODE$2;
    function setMaxNode$1(val) {
        MAX_NODE$2 = val;
    }
    const priorityHashText = function (priority) {
        if (typeof priority === 'number') {
            return 'number:' + doubleToIEEE754String(priority);
        }
        else {
            return 'string:' + priority;
        }
    };
    /**
     * Validates that a priority snapshot Node is valid.
     */
    const validatePriorityNode = function (priorityNode) {
        if (priorityNode.isLeafNode()) {
            const val = priorityNode.val();
            assert(typeof val === 'string' ||
                typeof val === 'number' ||
                (typeof val === 'object' && contains(val, '.sv')), 'Priority must be a string or number.');
        }
        else {
            assert(priorityNode === MAX_NODE$2 || priorityNode.isEmpty(), 'priority of unexpected type.');
        }
        // Don't call getPriority() on MAX_NODE to avoid hitting assertion.
        assert(priorityNode === MAX_NODE$2 || priorityNode.getPriority().isEmpty(), "Priority nodes can't have a priority of their own.");
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let __childrenNodeConstructor;
    /**
     * LeafNode is a class for storing leaf nodes in a DataSnapshot.  It
     * implements Node and stores the value of the node (a string,
     * number, or boolean) accessible via getValue().
     */
    class LeafNode {
        /**
         * @param value_ - The value to store in this leaf node. The object type is
         * possible in the event of a deferred value
         * @param priorityNode_ - The priority of this node.
         */
        constructor(value_, priorityNode_ = LeafNode.__childrenNodeConstructor.EMPTY_NODE) {
            this.value_ = value_;
            this.priorityNode_ = priorityNode_;
            this.lazyHash_ = null;
            assert(this.value_ !== undefined && this.value_ !== null, "LeafNode shouldn't be created with null/undefined value.");
            validatePriorityNode(this.priorityNode_);
        }
        static set __childrenNodeConstructor(val) {
            __childrenNodeConstructor = val;
        }
        static get __childrenNodeConstructor() {
            return __childrenNodeConstructor;
        }
        /** @inheritDoc */
        isLeafNode() {
            return true;
        }
        /** @inheritDoc */
        getPriority() {
            return this.priorityNode_;
        }
        /** @inheritDoc */
        updatePriority(newPriorityNode) {
            return new LeafNode(this.value_, newPriorityNode);
        }
        /** @inheritDoc */
        getImmediateChild(childName) {
            // Hack to treat priority as a regular child
            if (childName === '.priority') {
                return this.priorityNode_;
            }
            else {
                return LeafNode.__childrenNodeConstructor.EMPTY_NODE;
            }
        }
        /** @inheritDoc */
        getChild(path) {
            if (pathIsEmpty(path)) {
                return this;
            }
            else if (pathGetFront(path) === '.priority') {
                return this.priorityNode_;
            }
            else {
                return LeafNode.__childrenNodeConstructor.EMPTY_NODE;
            }
        }
        hasChild() {
            return false;
        }
        /** @inheritDoc */
        getPredecessorChildName(childName, childNode) {
            return null;
        }
        /** @inheritDoc */
        updateImmediateChild(childName, newChildNode) {
            if (childName === '.priority') {
                return this.updatePriority(newChildNode);
            }
            else if (newChildNode.isEmpty() && childName !== '.priority') {
                return this;
            }
            else {
                return LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(childName, newChildNode).updatePriority(this.priorityNode_);
            }
        }
        /** @inheritDoc */
        updateChild(path, newChildNode) {
            const front = pathGetFront(path);
            if (front === null) {
                return newChildNode;
            }
            else if (newChildNode.isEmpty() && front !== '.priority') {
                return this;
            }
            else {
                assert(front !== '.priority' || pathGetLength(path) === 1, '.priority must be the last token in a path');
                return this.updateImmediateChild(front, LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateChild(pathPopFront(path), newChildNode));
            }
        }
        /** @inheritDoc */
        isEmpty() {
            return false;
        }
        /** @inheritDoc */
        numChildren() {
            return 0;
        }
        /** @inheritDoc */
        forEachChild(index, action) {
            return false;
        }
        val(exportFormat) {
            if (exportFormat && !this.getPriority().isEmpty()) {
                return {
                    '.value': this.getValue(),
                    '.priority': this.getPriority().val()
                };
            }
            else {
                return this.getValue();
            }
        }
        /** @inheritDoc */
        hash() {
            if (this.lazyHash_ === null) {
                let toHash = '';
                if (!this.priorityNode_.isEmpty()) {
                    toHash +=
                        'priority:' +
                            priorityHashText(this.priorityNode_.val()) +
                            ':';
                }
                const type = typeof this.value_;
                toHash += type + ':';
                if (type === 'number') {
                    toHash += doubleToIEEE754String(this.value_);
                }
                else {
                    toHash += this.value_;
                }
                this.lazyHash_ = sha1(toHash);
            }
            return this.lazyHash_;
        }
        /**
         * Returns the value of the leaf node.
         * @returns The value of the node.
         */
        getValue() {
            return this.value_;
        }
        compareTo(other) {
            if (other === LeafNode.__childrenNodeConstructor.EMPTY_NODE) {
                return 1;
            }
            else if (other instanceof LeafNode.__childrenNodeConstructor) {
                return -1;
            }
            else {
                assert(other.isLeafNode(), 'Unknown node type');
                return this.compareToLeafNode_(other);
            }
        }
        /**
         * Comparison specifically for two leaf nodes
         */
        compareToLeafNode_(otherLeaf) {
            const otherLeafType = typeof otherLeaf.value_;
            const thisLeafType = typeof this.value_;
            const otherIndex = LeafNode.VALUE_TYPE_ORDER.indexOf(otherLeafType);
            const thisIndex = LeafNode.VALUE_TYPE_ORDER.indexOf(thisLeafType);
            assert(otherIndex >= 0, 'Unknown leaf type: ' + otherLeafType);
            assert(thisIndex >= 0, 'Unknown leaf type: ' + thisLeafType);
            if (otherIndex === thisIndex) {
                // Same type, compare values
                if (thisLeafType === 'object') {
                    // Deferred value nodes are all equal, but we should also never get to this point...
                    return 0;
                }
                else {
                    // Note that this works because true > false, all others are number or string comparisons
                    if (this.value_ < otherLeaf.value_) {
                        return -1;
                    }
                    else if (this.value_ === otherLeaf.value_) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                }
            }
            else {
                return thisIndex - otherIndex;
            }
        }
        withIndex() {
            return this;
        }
        isIndexed() {
            return true;
        }
        equals(other) {
            if (other === this) {
                return true;
            }
            else if (other.isLeafNode()) {
                const otherLeaf = other;
                return (this.value_ === otherLeaf.value_ &&
                    this.priorityNode_.equals(otherLeaf.priorityNode_));
            }
            else {
                return false;
            }
        }
    }
    /**
     * The sort order for comparing leaf nodes of different types. If two leaf nodes have
     * the same type, the comparison falls back to their value
     */
    LeafNode.VALUE_TYPE_ORDER = ['object', 'boolean', 'number', 'string'];

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let nodeFromJSON$1;
    let MAX_NODE$1;
    function setNodeFromJSON(val) {
        nodeFromJSON$1 = val;
    }
    function setMaxNode(val) {
        MAX_NODE$1 = val;
    }
    class PriorityIndex extends Index {
        compare(a, b) {
            const aPriority = a.node.getPriority();
            const bPriority = b.node.getPriority();
            const indexCmp = aPriority.compareTo(bPriority);
            if (indexCmp === 0) {
                return nameCompare(a.name, b.name);
            }
            else {
                return indexCmp;
            }
        }
        isDefinedOn(node) {
            return !node.getPriority().isEmpty();
        }
        indexedValueChanged(oldNode, newNode) {
            return !oldNode.getPriority().equals(newNode.getPriority());
        }
        minPost() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NamedNode.MIN;
        }
        maxPost() {
            return new NamedNode(MAX_NAME, new LeafNode('[PRIORITY-POST]', MAX_NODE$1));
        }
        makePost(indexValue, name) {
            const priorityNode = nodeFromJSON$1(indexValue);
            return new NamedNode(name, new LeafNode('[PRIORITY-POST]', priorityNode));
        }
        /**
         * @returns String representation for inclusion in a query spec
         */
        toString() {
            return '.priority';
        }
    }
    const PRIORITY_INDEX = new PriorityIndex();

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const LOG_2 = Math.log(2);
    class Base12Num {
        constructor(length) {
            const logBase2 = (num) => 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parseInt((Math.log(num) / LOG_2), 10);
            const bitMask = (bits) => parseInt(Array(bits + 1).join('1'), 2);
            this.count = logBase2(length + 1);
            this.current_ = this.count - 1;
            const mask = bitMask(this.count);
            this.bits_ = (length + 1) & mask;
        }
        nextBitIsOne() {
            //noinspection JSBitwiseOperatorUsage
            const result = !(this.bits_ & (0x1 << this.current_));
            this.current_--;
            return result;
        }
    }
    /**
     * Takes a list of child nodes and constructs a SortedSet using the given comparison
     * function
     *
     * Uses the algorithm described in the paper linked here:
     * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.46.1458
     *
     * @param childList - Unsorted list of children
     * @param cmp - The comparison method to be used
     * @param keyFn - An optional function to extract K from a node wrapper, if K's
     * type is not NamedNode
     * @param mapSortFn - An optional override for comparator used by the generated sorted map
     */
    const buildChildSet = function (childList, cmp, keyFn, mapSortFn) {
        childList.sort(cmp);
        const buildBalancedTree = function (low, high) {
            const length = high - low;
            let namedNode;
            let key;
            if (length === 0) {
                return null;
            }
            else if (length === 1) {
                namedNode = childList[low];
                key = keyFn ? keyFn(namedNode) : namedNode;
                return new LLRBNode(key, namedNode.node, LLRBNode.BLACK, null, null);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const middle = parseInt((length / 2), 10) + low;
                const left = buildBalancedTree(low, middle);
                const right = buildBalancedTree(middle + 1, high);
                namedNode = childList[middle];
                key = keyFn ? keyFn(namedNode) : namedNode;
                return new LLRBNode(key, namedNode.node, LLRBNode.BLACK, left, right);
            }
        };
        const buildFrom12Array = function (base12) {
            let node = null;
            let root = null;
            let index = childList.length;
            const buildPennant = function (chunkSize, color) {
                const low = index - chunkSize;
                const high = index;
                index -= chunkSize;
                const childTree = buildBalancedTree(low + 1, high);
                const namedNode = childList[low];
                const key = keyFn ? keyFn(namedNode) : namedNode;
                attachPennant(new LLRBNode(key, namedNode.node, color, null, childTree));
            };
            const attachPennant = function (pennant) {
                if (node) {
                    node.left = pennant;
                    node = pennant;
                }
                else {
                    root = pennant;
                    node = pennant;
                }
            };
            for (let i = 0; i < base12.count; ++i) {
                const isOne = base12.nextBitIsOne();
                // The number of nodes taken in each slice is 2^(arr.length - (i + 1))
                const chunkSize = Math.pow(2, base12.count - (i + 1));
                if (isOne) {
                    buildPennant(chunkSize, LLRBNode.BLACK);
                }
                else {
                    // current == 2
                    buildPennant(chunkSize, LLRBNode.BLACK);
                    buildPennant(chunkSize, LLRBNode.RED);
                }
            }
            return root;
        };
        const base12 = new Base12Num(childList.length);
        const root = buildFrom12Array(base12);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new SortedMap(mapSortFn || cmp, root);
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let _defaultIndexMap;
    const fallbackObject = {};
    class IndexMap {
        constructor(indexes_, indexSet_) {
            this.indexes_ = indexes_;
            this.indexSet_ = indexSet_;
        }
        /**
         * The default IndexMap for nodes without a priority
         */
        static get Default() {
            assert(fallbackObject && PRIORITY_INDEX, 'ChildrenNode.ts has not been loaded');
            _defaultIndexMap =
                _defaultIndexMap ||
                    new IndexMap({ '.priority': fallbackObject }, { '.priority': PRIORITY_INDEX });
            return _defaultIndexMap;
        }
        get(indexKey) {
            const sortedMap = safeGet(this.indexes_, indexKey);
            if (!sortedMap) {
                throw new Error('No index defined for ' + indexKey);
            }
            if (sortedMap instanceof SortedMap) {
                return sortedMap;
            }
            else {
                // The index exists, but it falls back to just name comparison. Return null so that the calling code uses the
                // regular child map
                return null;
            }
        }
        hasIndex(indexDefinition) {
            return contains(this.indexSet_, indexDefinition.toString());
        }
        addIndex(indexDefinition, existingChildren) {
            assert(indexDefinition !== KEY_INDEX, "KeyIndex always exists and isn't meant to be added to the IndexMap.");
            const childList = [];
            let sawIndexedValue = false;
            const iter = existingChildren.getIterator(NamedNode.Wrap);
            let next = iter.getNext();
            while (next) {
                sawIndexedValue =
                    sawIndexedValue || indexDefinition.isDefinedOn(next.node);
                childList.push(next);
                next = iter.getNext();
            }
            let newIndex;
            if (sawIndexedValue) {
                newIndex = buildChildSet(childList, indexDefinition.getCompare());
            }
            else {
                newIndex = fallbackObject;
            }
            const indexName = indexDefinition.toString();
            const newIndexSet = Object.assign({}, this.indexSet_);
            newIndexSet[indexName] = indexDefinition;
            const newIndexes = Object.assign({}, this.indexes_);
            newIndexes[indexName] = newIndex;
            return new IndexMap(newIndexes, newIndexSet);
        }
        /**
         * Ensure that this node is properly tracked in any indexes that we're maintaining
         */
        addToIndexes(namedNode, existingChildren) {
            const newIndexes = map(this.indexes_, (indexedChildren, indexName) => {
                const index = safeGet(this.indexSet_, indexName);
                assert(index, 'Missing index implementation for ' + indexName);
                if (indexedChildren === fallbackObject) {
                    // Check to see if we need to index everything
                    if (index.isDefinedOn(namedNode.node)) {
                        // We need to build this index
                        const childList = [];
                        const iter = existingChildren.getIterator(NamedNode.Wrap);
                        let next = iter.getNext();
                        while (next) {
                            if (next.name !== namedNode.name) {
                                childList.push(next);
                            }
                            next = iter.getNext();
                        }
                        childList.push(namedNode);
                        return buildChildSet(childList, index.getCompare());
                    }
                    else {
                        // No change, this remains a fallback
                        return fallbackObject;
                    }
                }
                else {
                    const existingSnap = existingChildren.get(namedNode.name);
                    let newChildren = indexedChildren;
                    if (existingSnap) {
                        newChildren = newChildren.remove(new NamedNode(namedNode.name, existingSnap));
                    }
                    return newChildren.insert(namedNode, namedNode.node);
                }
            });
            return new IndexMap(newIndexes, this.indexSet_);
        }
        /**
         * Create a new IndexMap instance with the given value removed
         */
        removeFromIndexes(namedNode, existingChildren) {
            const newIndexes = map(this.indexes_, (indexedChildren) => {
                if (indexedChildren === fallbackObject) {
                    // This is the fallback. Just return it, nothing to do in this case
                    return indexedChildren;
                }
                else {
                    const existingSnap = existingChildren.get(namedNode.name);
                    if (existingSnap) {
                        return indexedChildren.remove(new NamedNode(namedNode.name, existingSnap));
                    }
                    else {
                        // No record of this child
                        return indexedChildren;
                    }
                }
            });
            return new IndexMap(newIndexes, this.indexSet_);
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // TODO: For memory savings, don't store priorityNode_ if it's empty.
    let EMPTY_NODE;
    /**
     * ChildrenNode is a class for storing internal nodes in a DataSnapshot
     * (i.e. nodes with children).  It implements Node and stores the
     * list of children in the children property, sorted by child name.
     */
    class ChildrenNode {
        /**
         * @param children_ - List of children of this node..
         * @param priorityNode_ - The priority of this node (as a snapshot node).
         */
        constructor(children_, priorityNode_, indexMap_) {
            this.children_ = children_;
            this.priorityNode_ = priorityNode_;
            this.indexMap_ = indexMap_;
            this.lazyHash_ = null;
            /**
             * Note: The only reason we allow null priority is for EMPTY_NODE, since we can't use
             * EMPTY_NODE as the priority of EMPTY_NODE.  We might want to consider making EMPTY_NODE its own
             * class instead of an empty ChildrenNode.
             */
            if (this.priorityNode_) {
                validatePriorityNode(this.priorityNode_);
            }
            if (this.children_.isEmpty()) {
                assert(!this.priorityNode_ || this.priorityNode_.isEmpty(), 'An empty node cannot have a priority');
            }
        }
        static get EMPTY_NODE() {
            return (EMPTY_NODE ||
                (EMPTY_NODE = new ChildrenNode(new SortedMap(NAME_COMPARATOR), null, IndexMap.Default)));
        }
        /** @inheritDoc */
        isLeafNode() {
            return false;
        }
        /** @inheritDoc */
        getPriority() {
            return this.priorityNode_ || EMPTY_NODE;
        }
        /** @inheritDoc */
        updatePriority(newPriorityNode) {
            if (this.children_.isEmpty()) {
                // Don't allow priorities on empty nodes
                return this;
            }
            else {
                return new ChildrenNode(this.children_, newPriorityNode, this.indexMap_);
            }
        }
        /** @inheritDoc */
        getImmediateChild(childName) {
            // Hack to treat priority as a regular child
            if (childName === '.priority') {
                return this.getPriority();
            }
            else {
                const child = this.children_.get(childName);
                return child === null ? EMPTY_NODE : child;
            }
        }
        /** @inheritDoc */
        getChild(path) {
            const front = pathGetFront(path);
            if (front === null) {
                return this;
            }
            return this.getImmediateChild(front).getChild(pathPopFront(path));
        }
        /** @inheritDoc */
        hasChild(childName) {
            return this.children_.get(childName) !== null;
        }
        /** @inheritDoc */
        updateImmediateChild(childName, newChildNode) {
            assert(newChildNode, 'We should always be passing snapshot nodes');
            if (childName === '.priority') {
                return this.updatePriority(newChildNode);
            }
            else {
                const namedNode = new NamedNode(childName, newChildNode);
                let newChildren, newIndexMap;
                if (newChildNode.isEmpty()) {
                    newChildren = this.children_.remove(childName);
                    newIndexMap = this.indexMap_.removeFromIndexes(namedNode, this.children_);
                }
                else {
                    newChildren = this.children_.insert(childName, newChildNode);
                    newIndexMap = this.indexMap_.addToIndexes(namedNode, this.children_);
                }
                const newPriority = newChildren.isEmpty()
                    ? EMPTY_NODE
                    : this.priorityNode_;
                return new ChildrenNode(newChildren, newPriority, newIndexMap);
            }
        }
        /** @inheritDoc */
        updateChild(path, newChildNode) {
            const front = pathGetFront(path);
            if (front === null) {
                return newChildNode;
            }
            else {
                assert(pathGetFront(path) !== '.priority' || pathGetLength(path) === 1, '.priority must be the last token in a path');
                const newImmediateChild = this.getImmediateChild(front).updateChild(pathPopFront(path), newChildNode);
                return this.updateImmediateChild(front, newImmediateChild);
            }
        }
        /** @inheritDoc */
        isEmpty() {
            return this.children_.isEmpty();
        }
        /** @inheritDoc */
        numChildren() {
            return this.children_.count();
        }
        /** @inheritDoc */
        val(exportFormat) {
            if (this.isEmpty()) {
                return null;
            }
            const obj = {};
            let numKeys = 0, maxKey = 0, allIntegerKeys = true;
            this.forEachChild(PRIORITY_INDEX, (key, childNode) => {
                obj[key] = childNode.val(exportFormat);
                numKeys++;
                if (allIntegerKeys && ChildrenNode.INTEGER_REGEXP_.test(key)) {
                    maxKey = Math.max(maxKey, Number(key));
                }
                else {
                    allIntegerKeys = false;
                }
            });
            if (!exportFormat && allIntegerKeys && maxKey < 2 * numKeys) {
                // convert to array.
                const array = [];
                // eslint-disable-next-line guard-for-in
                for (const key in obj) {
                    array[key] = obj[key];
                }
                return array;
            }
            else {
                if (exportFormat && !this.getPriority().isEmpty()) {
                    obj['.priority'] = this.getPriority().val();
                }
                return obj;
            }
        }
        /** @inheritDoc */
        hash() {
            if (this.lazyHash_ === null) {
                let toHash = '';
                if (!this.getPriority().isEmpty()) {
                    toHash +=
                        'priority:' +
                            priorityHashText(this.getPriority().val()) +
                            ':';
                }
                this.forEachChild(PRIORITY_INDEX, (key, childNode) => {
                    const childHash = childNode.hash();
                    if (childHash !== '') {
                        toHash += ':' + key + ':' + childHash;
                    }
                });
                this.lazyHash_ = toHash === '' ? '' : sha1(toHash);
            }
            return this.lazyHash_;
        }
        /** @inheritDoc */
        getPredecessorChildName(childName, childNode, index) {
            const idx = this.resolveIndex_(index);
            if (idx) {
                const predecessor = idx.getPredecessorKey(new NamedNode(childName, childNode));
                return predecessor ? predecessor.name : null;
            }
            else {
                return this.children_.getPredecessorKey(childName);
            }
        }
        getFirstChildName(indexDefinition) {
            const idx = this.resolveIndex_(indexDefinition);
            if (idx) {
                const minKey = idx.minKey();
                return minKey && minKey.name;
            }
            else {
                return this.children_.minKey();
            }
        }
        getFirstChild(indexDefinition) {
            const minKey = this.getFirstChildName(indexDefinition);
            if (minKey) {
                return new NamedNode(minKey, this.children_.get(minKey));
            }
            else {
                return null;
            }
        }
        /**
         * Given an index, return the key name of the largest value we have, according to that index
         */
        getLastChildName(indexDefinition) {
            const idx = this.resolveIndex_(indexDefinition);
            if (idx) {
                const maxKey = idx.maxKey();
                return maxKey && maxKey.name;
            }
            else {
                return this.children_.maxKey();
            }
        }
        getLastChild(indexDefinition) {
            const maxKey = this.getLastChildName(indexDefinition);
            if (maxKey) {
                return new NamedNode(maxKey, this.children_.get(maxKey));
            }
            else {
                return null;
            }
        }
        forEachChild(index, action) {
            const idx = this.resolveIndex_(index);
            if (idx) {
                return idx.inorderTraversal(wrappedNode => {
                    return action(wrappedNode.name, wrappedNode.node);
                });
            }
            else {
                return this.children_.inorderTraversal(action);
            }
        }
        getIterator(indexDefinition) {
            return this.getIteratorFrom(indexDefinition.minPost(), indexDefinition);
        }
        getIteratorFrom(startPost, indexDefinition) {
            const idx = this.resolveIndex_(indexDefinition);
            if (idx) {
                return idx.getIteratorFrom(startPost, key => key);
            }
            else {
                const iterator = this.children_.getIteratorFrom(startPost.name, NamedNode.Wrap);
                let next = iterator.peek();
                while (next != null && indexDefinition.compare(next, startPost) < 0) {
                    iterator.getNext();
                    next = iterator.peek();
                }
                return iterator;
            }
        }
        getReverseIterator(indexDefinition) {
            return this.getReverseIteratorFrom(indexDefinition.maxPost(), indexDefinition);
        }
        getReverseIteratorFrom(endPost, indexDefinition) {
            const idx = this.resolveIndex_(indexDefinition);
            if (idx) {
                return idx.getReverseIteratorFrom(endPost, key => {
                    return key;
                });
            }
            else {
                const iterator = this.children_.getReverseIteratorFrom(endPost.name, NamedNode.Wrap);
                let next = iterator.peek();
                while (next != null && indexDefinition.compare(next, endPost) > 0) {
                    iterator.getNext();
                    next = iterator.peek();
                }
                return iterator;
            }
        }
        compareTo(other) {
            if (this.isEmpty()) {
                if (other.isEmpty()) {
                    return 0;
                }
                else {
                    return -1;
                }
            }
            else if (other.isLeafNode() || other.isEmpty()) {
                return 1;
            }
            else if (other === MAX_NODE) {
                return -1;
            }
            else {
                // Must be another node with children.
                return 0;
            }
        }
        withIndex(indexDefinition) {
            if (indexDefinition === KEY_INDEX ||
                this.indexMap_.hasIndex(indexDefinition)) {
                return this;
            }
            else {
                const newIndexMap = this.indexMap_.addIndex(indexDefinition, this.children_);
                return new ChildrenNode(this.children_, this.priorityNode_, newIndexMap);
            }
        }
        isIndexed(index) {
            return index === KEY_INDEX || this.indexMap_.hasIndex(index);
        }
        equals(other) {
            if (other === this) {
                return true;
            }
            else if (other.isLeafNode()) {
                return false;
            }
            else {
                const otherChildrenNode = other;
                if (!this.getPriority().equals(otherChildrenNode.getPriority())) {
                    return false;
                }
                else if (this.children_.count() === otherChildrenNode.children_.count()) {
                    const thisIter = this.getIterator(PRIORITY_INDEX);
                    const otherIter = otherChildrenNode.getIterator(PRIORITY_INDEX);
                    let thisCurrent = thisIter.getNext();
                    let otherCurrent = otherIter.getNext();
                    while (thisCurrent && otherCurrent) {
                        if (thisCurrent.name !== otherCurrent.name ||
                            !thisCurrent.node.equals(otherCurrent.node)) {
                            return false;
                        }
                        thisCurrent = thisIter.getNext();
                        otherCurrent = otherIter.getNext();
                    }
                    return thisCurrent === null && otherCurrent === null;
                }
                else {
                    return false;
                }
            }
        }
        /**
         * Returns a SortedMap ordered by index, or null if the default (by-key) ordering can be used
         * instead.
         *
         */
        resolveIndex_(indexDefinition) {
            if (indexDefinition === KEY_INDEX) {
                return null;
            }
            else {
                return this.indexMap_.get(indexDefinition.toString());
            }
        }
    }
    ChildrenNode.INTEGER_REGEXP_ = /^(0|[1-9]\d*)$/;
    class MaxNode extends ChildrenNode {
        constructor() {
            super(new SortedMap(NAME_COMPARATOR), ChildrenNode.EMPTY_NODE, IndexMap.Default);
        }
        compareTo(other) {
            if (other === this) {
                return 0;
            }
            else {
                return 1;
            }
        }
        equals(other) {
            // Not that we every compare it, but MAX_NODE is only ever equal to itself
            return other === this;
        }
        getPriority() {
            return this;
        }
        getImmediateChild(childName) {
            return ChildrenNode.EMPTY_NODE;
        }
        isEmpty() {
            return false;
        }
    }
    /**
     * Marker that will sort higher than any other snapshot.
     */
    const MAX_NODE = new MaxNode();
    Object.defineProperties(NamedNode, {
        MIN: {
            value: new NamedNode(MIN_NAME, ChildrenNode.EMPTY_NODE)
        },
        MAX: {
            value: new NamedNode(MAX_NAME, MAX_NODE)
        }
    });
    /**
     * Reference Extensions
     */
    KeyIndex.__EMPTY_NODE = ChildrenNode.EMPTY_NODE;
    LeafNode.__childrenNodeConstructor = ChildrenNode;
    setMaxNode$1(MAX_NODE);
    setMaxNode(MAX_NODE);

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const USE_HINZE = true;
    /**
     * Constructs a snapshot node representing the passed JSON and returns it.
     * @param json - JSON to create a node for.
     * @param priority - Optional priority to use.  This will be ignored if the
     * passed JSON contains a .priority property.
     */
    function nodeFromJSON(json, priority = null) {
        if (json === null) {
            return ChildrenNode.EMPTY_NODE;
        }
        if (typeof json === 'object' && '.priority' in json) {
            priority = json['.priority'];
        }
        assert(priority === null ||
            typeof priority === 'string' ||
            typeof priority === 'number' ||
            (typeof priority === 'object' && '.sv' in priority), 'Invalid priority type found: ' + typeof priority);
        if (typeof json === 'object' && '.value' in json && json['.value'] !== null) {
            json = json['.value'];
        }
        // Valid leaf nodes include non-objects or server-value wrapper objects
        if (typeof json !== 'object' || '.sv' in json) {
            const jsonLeaf = json;
            return new LeafNode(jsonLeaf, nodeFromJSON(priority));
        }
        if (!(json instanceof Array) && USE_HINZE) {
            const children = [];
            let childrenHavePriority = false;
            const hinzeJsonObj = json;
            each(hinzeJsonObj, (key, child) => {
                if (key.substring(0, 1) !== '.') {
                    // Ignore metadata nodes
                    const childNode = nodeFromJSON(child);
                    if (!childNode.isEmpty()) {
                        childrenHavePriority =
                            childrenHavePriority || !childNode.getPriority().isEmpty();
                        children.push(new NamedNode(key, childNode));
                    }
                }
            });
            if (children.length === 0) {
                return ChildrenNode.EMPTY_NODE;
            }
            const childSet = buildChildSet(children, NAME_ONLY_COMPARATOR, namedNode => namedNode.name, NAME_COMPARATOR);
            if (childrenHavePriority) {
                const sortedChildSet = buildChildSet(children, PRIORITY_INDEX.getCompare());
                return new ChildrenNode(childSet, nodeFromJSON(priority), new IndexMap({ '.priority': sortedChildSet }, { '.priority': PRIORITY_INDEX }));
            }
            else {
                return new ChildrenNode(childSet, nodeFromJSON(priority), IndexMap.Default);
            }
        }
        else {
            let node = ChildrenNode.EMPTY_NODE;
            each(json, (key, childData) => {
                if (contains(json, key)) {
                    if (key.substring(0, 1) !== '.') {
                        // ignore metadata nodes.
                        const childNode = nodeFromJSON(childData);
                        if (childNode.isLeafNode() || !childNode.isEmpty()) {
                            node = node.updateImmediateChild(key, childNode);
                        }
                    }
                }
            });
            return node.updatePriority(nodeFromJSON(priority));
        }
    }
    setNodeFromJSON(nodeFromJSON);

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class PathIndex extends Index {
        constructor(indexPath_) {
            super();
            this.indexPath_ = indexPath_;
            assert(!pathIsEmpty(indexPath_) && pathGetFront(indexPath_) !== '.priority', "Can't create PathIndex with empty path or .priority key");
        }
        extractChild(snap) {
            return snap.getChild(this.indexPath_);
        }
        isDefinedOn(node) {
            return !node.getChild(this.indexPath_).isEmpty();
        }
        compare(a, b) {
            const aChild = this.extractChild(a.node);
            const bChild = this.extractChild(b.node);
            const indexCmp = aChild.compareTo(bChild);
            if (indexCmp === 0) {
                return nameCompare(a.name, b.name);
            }
            else {
                return indexCmp;
            }
        }
        makePost(indexValue, name) {
            const valueNode = nodeFromJSON(indexValue);
            const node = ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_, valueNode);
            return new NamedNode(name, node);
        }
        maxPost() {
            const node = ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_, MAX_NODE);
            return new NamedNode(MAX_NAME, node);
        }
        toString() {
            return pathSlice(this.indexPath_, 0).join('/');
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class ValueIndex extends Index {
        compare(a, b) {
            const indexCmp = a.node.compareTo(b.node);
            if (indexCmp === 0) {
                return nameCompare(a.name, b.name);
            }
            else {
                return indexCmp;
            }
        }
        isDefinedOn(node) {
            return true;
        }
        indexedValueChanged(oldNode, newNode) {
            return !oldNode.equals(newNode);
        }
        minPost() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NamedNode.MIN;
        }
        maxPost() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return NamedNode.MAX;
        }
        makePost(indexValue, name) {
            const valueNode = nodeFromJSON(indexValue);
            return new NamedNode(name, valueNode);
        }
        /**
         * @returns String representation for inclusion in a query spec
         */
        toString() {
            return '.value';
        }
    }
    const VALUE_INDEX = new ValueIndex();

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function changeValue(snapshotNode) {
        return { type: "value" /* ChangeType.VALUE */, snapshotNode };
    }
    function changeChildAdded(childName, snapshotNode) {
        return { type: "child_added" /* ChangeType.CHILD_ADDED */, snapshotNode, childName };
    }
    function changeChildRemoved(childName, snapshotNode) {
        return { type: "child_removed" /* ChangeType.CHILD_REMOVED */, snapshotNode, childName };
    }
    function changeChildChanged(childName, snapshotNode, oldSnap) {
        return {
            type: "child_changed" /* ChangeType.CHILD_CHANGED */,
            snapshotNode,
            childName,
            oldSnap
        };
    }
    function changeChildMoved(childName, snapshotNode) {
        return { type: "child_moved" /* ChangeType.CHILD_MOVED */, snapshotNode, childName };
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * This class is an immutable-from-the-public-api struct containing a set of query parameters defining a
     * range to be returned for a particular location. It is assumed that validation of parameters is done at the
     * user-facing API level, so it is not done here.
     *
     * @internal
     */
    class QueryParams {
        constructor() {
            this.limitSet_ = false;
            this.startSet_ = false;
            this.startNameSet_ = false;
            this.startAfterSet_ = false; // can only be true if startSet_ is true
            this.endSet_ = false;
            this.endNameSet_ = false;
            this.endBeforeSet_ = false; // can only be true if endSet_ is true
            this.limit_ = 0;
            this.viewFrom_ = '';
            this.indexStartValue_ = null;
            this.indexStartName_ = '';
            this.indexEndValue_ = null;
            this.indexEndName_ = '';
            this.index_ = PRIORITY_INDEX;
        }
        hasStart() {
            return this.startSet_;
        }
        /**
         * @returns True if it would return from left.
         */
        isViewFromLeft() {
            if (this.viewFrom_ === '') {
                // limit(), rather than limitToFirst or limitToLast was called.
                // This means that only one of startSet_ and endSet_ is true. Use them
                // to calculate which side of the view to anchor to. If neither is set,
                // anchor to the end.
                return this.startSet_;
            }
            else {
                return this.viewFrom_ === "l" /* WIRE_PROTOCOL_CONSTANTS.VIEW_FROM_LEFT */;
            }
        }
        /**
         * Only valid to call if hasStart() returns true
         */
        getIndexStartValue() {
            assert(this.startSet_, 'Only valid if start has been set');
            return this.indexStartValue_;
        }
        /**
         * Only valid to call if hasStart() returns true.
         * Returns the starting key name for the range defined by these query parameters
         */
        getIndexStartName() {
            assert(this.startSet_, 'Only valid if start has been set');
            if (this.startNameSet_) {
                return this.indexStartName_;
            }
            else {
                return MIN_NAME;
            }
        }
        hasEnd() {
            return this.endSet_;
        }
        /**
         * Only valid to call if hasEnd() returns true.
         */
        getIndexEndValue() {
            assert(this.endSet_, 'Only valid if end has been set');
            return this.indexEndValue_;
        }
        /**
         * Only valid to call if hasEnd() returns true.
         * Returns the end key name for the range defined by these query parameters
         */
        getIndexEndName() {
            assert(this.endSet_, 'Only valid if end has been set');
            if (this.endNameSet_) {
                return this.indexEndName_;
            }
            else {
                return MAX_NAME;
            }
        }
        hasLimit() {
            return this.limitSet_;
        }
        /**
         * @returns True if a limit has been set and it has been explicitly anchored
         */
        hasAnchoredLimit() {
            return this.limitSet_ && this.viewFrom_ !== '';
        }
        /**
         * Only valid to call if hasLimit() returns true
         */
        getLimit() {
            assert(this.limitSet_, 'Only valid if limit has been set');
            return this.limit_;
        }
        getIndex() {
            return this.index_;
        }
        loadsAllData() {
            return !(this.startSet_ || this.endSet_ || this.limitSet_);
        }
        isDefault() {
            return this.loadsAllData() && this.index_ === PRIORITY_INDEX;
        }
        copy() {
            const copy = new QueryParams();
            copy.limitSet_ = this.limitSet_;
            copy.limit_ = this.limit_;
            copy.startSet_ = this.startSet_;
            copy.startAfterSet_ = this.startAfterSet_;
            copy.indexStartValue_ = this.indexStartValue_;
            copy.startNameSet_ = this.startNameSet_;
            copy.indexStartName_ = this.indexStartName_;
            copy.endSet_ = this.endSet_;
            copy.endBeforeSet_ = this.endBeforeSet_;
            copy.indexEndValue_ = this.indexEndValue_;
            copy.endNameSet_ = this.endNameSet_;
            copy.indexEndName_ = this.indexEndName_;
            copy.index_ = this.index_;
            copy.viewFrom_ = this.viewFrom_;
            return copy;
        }
    }
    /**
     * Returns a set of REST query string parameters representing this query.
     *
     * @returns query string parameters
     */
    function queryParamsToRestQueryStringParameters(queryParams) {
        const qs = {};
        if (queryParams.isDefault()) {
            return qs;
        }
        let orderBy;
        if (queryParams.index_ === PRIORITY_INDEX) {
            orderBy = "$priority" /* REST_QUERY_CONSTANTS.PRIORITY_INDEX */;
        }
        else if (queryParams.index_ === VALUE_INDEX) {
            orderBy = "$value" /* REST_QUERY_CONSTANTS.VALUE_INDEX */;
        }
        else if (queryParams.index_ === KEY_INDEX) {
            orderBy = "$key" /* REST_QUERY_CONSTANTS.KEY_INDEX */;
        }
        else {
            assert(queryParams.index_ instanceof PathIndex, 'Unrecognized index type!');
            orderBy = queryParams.index_.toString();
        }
        qs["orderBy" /* REST_QUERY_CONSTANTS.ORDER_BY */] = stringify(orderBy);
        if (queryParams.startSet_) {
            const startParam = queryParams.startAfterSet_
                ? "startAfter" /* REST_QUERY_CONSTANTS.START_AFTER */
                : "startAt" /* REST_QUERY_CONSTANTS.START_AT */;
            qs[startParam] = stringify(queryParams.indexStartValue_);
            if (queryParams.startNameSet_) {
                qs[startParam] += ',' + stringify(queryParams.indexStartName_);
            }
        }
        if (queryParams.endSet_) {
            const endParam = queryParams.endBeforeSet_
                ? "endBefore" /* REST_QUERY_CONSTANTS.END_BEFORE */
                : "endAt" /* REST_QUERY_CONSTANTS.END_AT */;
            qs[endParam] = stringify(queryParams.indexEndValue_);
            if (queryParams.endNameSet_) {
                qs[endParam] += ',' + stringify(queryParams.indexEndName_);
            }
        }
        if (queryParams.limitSet_) {
            if (queryParams.isViewFromLeft()) {
                qs["limitToFirst" /* REST_QUERY_CONSTANTS.LIMIT_TO_FIRST */] = queryParams.limit_;
            }
            else {
                qs["limitToLast" /* REST_QUERY_CONSTANTS.LIMIT_TO_LAST */] = queryParams.limit_;
            }
        }
        return qs;
    }
    function queryParamsGetQueryObject(queryParams) {
        const obj = {};
        if (queryParams.startSet_) {
            obj["sp" /* WIRE_PROTOCOL_CONSTANTS.INDEX_START_VALUE */] =
                queryParams.indexStartValue_;
            if (queryParams.startNameSet_) {
                obj["sn" /* WIRE_PROTOCOL_CONSTANTS.INDEX_START_NAME */] =
                    queryParams.indexStartName_;
            }
            obj["sin" /* WIRE_PROTOCOL_CONSTANTS.INDEX_START_IS_INCLUSIVE */] =
                !queryParams.startAfterSet_;
        }
        if (queryParams.endSet_) {
            obj["ep" /* WIRE_PROTOCOL_CONSTANTS.INDEX_END_VALUE */] = queryParams.indexEndValue_;
            if (queryParams.endNameSet_) {
                obj["en" /* WIRE_PROTOCOL_CONSTANTS.INDEX_END_NAME */] = queryParams.indexEndName_;
            }
            obj["ein" /* WIRE_PROTOCOL_CONSTANTS.INDEX_END_IS_INCLUSIVE */] =
                !queryParams.endBeforeSet_;
        }
        if (queryParams.limitSet_) {
            obj["l" /* WIRE_PROTOCOL_CONSTANTS.LIMIT */] = queryParams.limit_;
            let viewFrom = queryParams.viewFrom_;
            if (viewFrom === '') {
                if (queryParams.isViewFromLeft()) {
                    viewFrom = "l" /* WIRE_PROTOCOL_CONSTANTS.VIEW_FROM_LEFT */;
                }
                else {
                    viewFrom = "r" /* WIRE_PROTOCOL_CONSTANTS.VIEW_FROM_RIGHT */;
                }
            }
            obj["vf" /* WIRE_PROTOCOL_CONSTANTS.VIEW_FROM */] = viewFrom;
        }
        // For now, priority index is the default, so we only specify if it's some other index
        if (queryParams.index_ !== PRIORITY_INDEX) {
            obj["i" /* WIRE_PROTOCOL_CONSTANTS.INDEX */] = queryParams.index_.toString();
        }
        return obj;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * An implementation of ServerActions that communicates with the server via REST requests.
     * This is mostly useful for compatibility with crawlers, where we don't want to spin up a full
     * persistent connection (using WebSockets or long-polling)
     */
    class ReadonlyRestClient extends ServerActions {
        /**
         * @param repoInfo_ - Data about the namespace we are connecting to
         * @param onDataUpdate_ - A callback for new data from the server
         */
        constructor(repoInfo_, onDataUpdate_, authTokenProvider_, appCheckTokenProvider_) {
            super();
            this.repoInfo_ = repoInfo_;
            this.onDataUpdate_ = onDataUpdate_;
            this.authTokenProvider_ = authTokenProvider_;
            this.appCheckTokenProvider_ = appCheckTokenProvider_;
            /** @private {function(...[*])} */
            this.log_ = logWrapper('p:rest:');
            /**
             * We don't actually need to track listens, except to prevent us calling an onComplete for a listen
             * that's been removed. :-/
             */
            this.listens_ = {};
        }
        reportStats(stats) {
            throw new Error('Method not implemented.');
        }
        static getListenId_(query, tag) {
            if (tag !== undefined) {
                return 'tag$' + tag;
            }
            else {
                assert(query._queryParams.isDefault(), "should have a tag if it's not a default query.");
                return query._path.toString();
            }
        }
        /** @inheritDoc */
        listen(query, currentHashFn, tag, onComplete) {
            const pathString = query._path.toString();
            this.log_('Listen called for ' + pathString + ' ' + query._queryIdentifier);
            // Mark this listener so we can tell if it's removed.
            const listenId = ReadonlyRestClient.getListenId_(query, tag);
            const thisListen = {};
            this.listens_[listenId] = thisListen;
            const queryStringParameters = queryParamsToRestQueryStringParameters(query._queryParams);
            this.restRequest_(pathString + '.json', queryStringParameters, (error, result) => {
                let data = result;
                if (error === 404) {
                    data = null;
                    error = null;
                }
                if (error === null) {
                    this.onDataUpdate_(pathString, data, /*isMerge=*/ false, tag);
                }
                if (safeGet(this.listens_, listenId) === thisListen) {
                    let status;
                    if (!error) {
                        status = 'ok';
                    }
                    else if (error === 401) {
                        status = 'permission_denied';
                    }
                    else {
                        status = 'rest_error:' + error;
                    }
                    onComplete(status, null);
                }
            });
        }
        /** @inheritDoc */
        unlisten(query, tag) {
            const listenId = ReadonlyRestClient.getListenId_(query, tag);
            delete this.listens_[listenId];
        }
        get(query) {
            const queryStringParameters = queryParamsToRestQueryStringParameters(query._queryParams);
            const pathString = query._path.toString();
            const deferred = new Deferred();
            this.restRequest_(pathString + '.json', queryStringParameters, (error, result) => {
                let data = result;
                if (error === 404) {
                    data = null;
                    error = null;
                }
                if (error === null) {
                    this.onDataUpdate_(pathString, data, 
                    /*isMerge=*/ false, 
                    /*tag=*/ null);
                    deferred.resolve(data);
                }
                else {
                    deferred.reject(new Error(data));
                }
            });
            return deferred.promise;
        }
        /** @inheritDoc */
        refreshAuthToken(token) {
            // no-op since we just always call getToken.
        }
        /**
         * Performs a REST request to the given path, with the provided query string parameters,
         * and any auth credentials we have.
         */
        restRequest_(pathString, queryStringParameters = {}, callback) {
            queryStringParameters['format'] = 'export';
            return Promise.all([
                this.authTokenProvider_.getToken(/*forceRefresh=*/ false),
                this.appCheckTokenProvider_.getToken(/*forceRefresh=*/ false)
            ]).then(([authToken, appCheckToken]) => {
                if (authToken && authToken.accessToken) {
                    queryStringParameters['auth'] = authToken.accessToken;
                }
                if (appCheckToken && appCheckToken.token) {
                    queryStringParameters['ac'] = appCheckToken.token;
                }
                const url = (this.repoInfo_.secure ? 'https://' : 'http://') +
                    this.repoInfo_.host +
                    pathString +
                    '?' +
                    'ns=' +
                    this.repoInfo_.namespace +
                    querystring(queryStringParameters);
                this.log_('Sending REST request for ' + url);
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (callback && xhr.readyState === 4) {
                        this.log_('REST Response for ' + url + ' received. status:', xhr.status, 'response:', xhr.responseText);
                        let res = null;
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                res = jsonEval(xhr.responseText);
                            }
                            catch (e) {
                                warn('Failed to parse JSON response for ' +
                                    url +
                                    ': ' +
                                    xhr.responseText);
                            }
                            callback(null, res);
                        }
                        else {
                            // 401 and 404 are expected.
                            if (xhr.status !== 401 && xhr.status !== 404) {
                                warn('Got unsuccessful REST response for ' +
                                    url +
                                    ' Status: ' +
                                    xhr.status);
                            }
                            callback(xhr.status);
                        }
                        callback = null;
                    }
                };
                xhr.open('GET', url, /*asynchronous=*/ true);
                xhr.send();
            });
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Mutable object which basically just stores a reference to the "latest" immutable snapshot.
     */
    class SnapshotHolder {
        constructor() {
            this.rootNode_ = ChildrenNode.EMPTY_NODE;
        }
        getNode(path) {
            return this.rootNode_.getChild(path);
        }
        updateSnapshot(path, newSnapshotNode) {
            this.rootNode_ = this.rootNode_.updateChild(path, newSnapshotNode);
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function newSparseSnapshotTree() {
        return {
            value: null,
            children: new Map()
        };
    }
    /**
     * Stores the given node at the specified path. If there is already a node
     * at a shallower path, it merges the new data into that snapshot node.
     *
     * @param path - Path to look up snapshot for.
     * @param data - The new data, or null.
     */
    function sparseSnapshotTreeRemember(sparseSnapshotTree, path, data) {
        if (pathIsEmpty(path)) {
            sparseSnapshotTree.value = data;
            sparseSnapshotTree.children.clear();
        }
        else if (sparseSnapshotTree.value !== null) {
            sparseSnapshotTree.value = sparseSnapshotTree.value.updateChild(path, data);
        }
        else {
            const childKey = pathGetFront(path);
            if (!sparseSnapshotTree.children.has(childKey)) {
                sparseSnapshotTree.children.set(childKey, newSparseSnapshotTree());
            }
            const child = sparseSnapshotTree.children.get(childKey);
            path = pathPopFront(path);
            sparseSnapshotTreeRemember(child, path, data);
        }
    }
    /**
     * Recursively iterates through all of the stored tree and calls the
     * callback on each one.
     *
     * @param prefixPath - Path to look up node for.
     * @param func - The function to invoke for each tree.
     */
    function sparseSnapshotTreeForEachTree(sparseSnapshotTree, prefixPath, func) {
        if (sparseSnapshotTree.value !== null) {
            func(prefixPath, sparseSnapshotTree.value);
        }
        else {
            sparseSnapshotTreeForEachChild(sparseSnapshotTree, (key, tree) => {
                const path = new Path(prefixPath.toString() + '/' + key);
                sparseSnapshotTreeForEachTree(tree, path, func);
            });
        }
    }
    /**
     * Iterates through each immediate child and triggers the callback.
     * Only seems to be used in tests.
     *
     * @param func - The function to invoke for each child.
     */
    function sparseSnapshotTreeForEachChild(sparseSnapshotTree, func) {
        sparseSnapshotTree.children.forEach((tree, key) => {
            func(key, tree);
        });
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Returns the delta from the previous call to get stats.
     *
     * @param collection_ - The collection to "listen" to.
     */
    class StatsListener {
        constructor(collection_) {
            this.collection_ = collection_;
            this.last_ = null;
        }
        get() {
            const newStats = this.collection_.get();
            const delta = Object.assign({}, newStats);
            if (this.last_) {
                each(this.last_, (stat, value) => {
                    delta[stat] = delta[stat] - value;
                });
            }
            this.last_ = newStats;
            return delta;
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // Assuming some apps may have a short amount of time on page, and a bulk of firebase operations probably
    // happen on page load, we try to report our first set of stats pretty quickly, but we wait at least 10
    // seconds to try to ensure the Firebase connection is established / settled.
    const FIRST_STATS_MIN_TIME = 10 * 1000;
    const FIRST_STATS_MAX_TIME = 30 * 1000;
    // We'll continue to report stats on average every 5 minutes.
    const REPORT_STATS_INTERVAL = 5 * 60 * 1000;
    class StatsReporter {
        constructor(collection, server_) {
            this.server_ = server_;
            this.statsToReport_ = {};
            this.statsListener_ = new StatsListener(collection);
            const timeout = FIRST_STATS_MIN_TIME +
                (FIRST_STATS_MAX_TIME - FIRST_STATS_MIN_TIME) * Math.random();
            setTimeoutNonBlocking(this.reportStats_.bind(this), Math.floor(timeout));
        }
        reportStats_() {
            const stats = this.statsListener_.get();
            const reportedStats = {};
            let haveStatsToReport = false;
            each(stats, (stat, value) => {
                if (value > 0 && contains(this.statsToReport_, stat)) {
                    reportedStats[stat] = value;
                    haveStatsToReport = true;
                }
            });
            if (haveStatsToReport) {
                this.server_.reportStats(reportedStats);
            }
            // queue our next run.
            setTimeoutNonBlocking(this.reportStats_.bind(this), Math.floor(Math.random() * 2 * REPORT_STATS_INTERVAL));
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     *
     * @enum
     */
    var OperationType;
    (function (OperationType) {
        OperationType[OperationType["OVERWRITE"] = 0] = "OVERWRITE";
        OperationType[OperationType["MERGE"] = 1] = "MERGE";
        OperationType[OperationType["ACK_USER_WRITE"] = 2] = "ACK_USER_WRITE";
        OperationType[OperationType["LISTEN_COMPLETE"] = 3] = "LISTEN_COMPLETE";
    })(OperationType || (OperationType = {}));
    function newOperationSourceUser() {
        return {
            fromUser: true,
            fromServer: false,
            queryId: null,
            tagged: false
        };
    }
    function newOperationSourceServer() {
        return {
            fromUser: false,
            fromServer: true,
            queryId: null,
            tagged: false
        };
    }
    function newOperationSourceServerTaggedQuery(queryId) {
        return {
            fromUser: false,
            fromServer: true,
            queryId,
            tagged: true
        };
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class AckUserWrite {
        /**
         * @param affectedTree - A tree containing true for each affected path. Affected paths can't overlap.
         */
        constructor(
        /** @inheritDoc */ path, 
        /** @inheritDoc */ affectedTree, 
        /** @inheritDoc */ revert) {
            this.path = path;
            this.affectedTree = affectedTree;
            this.revert = revert;
            /** @inheritDoc */
            this.type = OperationType.ACK_USER_WRITE;
            /** @inheritDoc */
            this.source = newOperationSourceUser();
        }
        operationForChild(childName) {
            if (!pathIsEmpty(this.path)) {
                assert(pathGetFront(this.path) === childName, 'operationForChild called for unrelated child.');
                return new AckUserWrite(pathPopFront(this.path), this.affectedTree, this.revert);
            }
            else if (this.affectedTree.value != null) {
                assert(this.affectedTree.children.isEmpty(), 'affectedTree should not have overlapping affected paths.');
                // All child locations are affected as well; just return same operation.
                return this;
            }
            else {
                const childTree = this.affectedTree.subtree(new Path(childName));
                return new AckUserWrite(newEmptyPath(), childTree, this.revert);
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class Overwrite {
        constructor(source, path, snap) {
            this.source = source;
            this.path = path;
            this.snap = snap;
            /** @inheritDoc */
            this.type = OperationType.OVERWRITE;
        }
        operationForChild(childName) {
            if (pathIsEmpty(this.path)) {
                return new Overwrite(this.source, newEmptyPath(), this.snap.getImmediateChild(childName));
            }
            else {
                return new Overwrite(this.source, pathPopFront(this.path), this.snap);
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class Merge {
        constructor(
        /** @inheritDoc */ source, 
        /** @inheritDoc */ path, 
        /** @inheritDoc */ children) {
            this.source = source;
            this.path = path;
            this.children = children;
            /** @inheritDoc */
            this.type = OperationType.MERGE;
        }
        operationForChild(childName) {
            if (pathIsEmpty(this.path)) {
                const childTree = this.children.subtree(new Path(childName));
                if (childTree.isEmpty()) {
                    // This child is unaffected
                    return null;
                }
                else if (childTree.value) {
                    // We have a snapshot for the child in question.  This becomes an overwrite of the child.
                    return new Overwrite(this.source, newEmptyPath(), childTree.value);
                }
                else {
                    // This is a merge at a deeper level
                    return new Merge(this.source, newEmptyPath(), childTree);
                }
            }
            else {
                assert(pathGetFront(this.path) === childName, "Can't get a merge for a child not on the path of the operation");
                return new Merge(this.source, pathPopFront(this.path), this.children);
            }
        }
        toString() {
            return ('Operation(' +
                this.path +
                ': ' +
                this.source.toString() +
                ' merge: ' +
                this.children.toString() +
                ')');
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * A cache node only stores complete children. Additionally it holds a flag whether the node can be considered fully
     * initialized in the sense that we know at one point in time this represented a valid state of the world, e.g.
     * initialized with data from the server, or a complete overwrite by the client. The filtered flag also tracks
     * whether a node potentially had children removed due to a filter.
     */
    class CacheNode {
        constructor(node_, fullyInitialized_, filtered_) {
            this.node_ = node_;
            this.fullyInitialized_ = fullyInitialized_;
            this.filtered_ = filtered_;
        }
        /**
         * Returns whether this node was fully initialized with either server data or a complete overwrite by the client
         */
        isFullyInitialized() {
            return this.fullyInitialized_;
        }
        /**
         * Returns whether this node is potentially missing children due to a filter applied to the node
         */
        isFiltered() {
            return this.filtered_;
        }
        isCompleteForPath(path) {
            if (pathIsEmpty(path)) {
                return this.isFullyInitialized() && !this.filtered_;
            }
            const childKey = pathGetFront(path);
            return this.isCompleteForChild(childKey);
        }
        isCompleteForChild(key) {
            return ((this.isFullyInitialized() && !this.filtered_) || this.node_.hasChild(key));
        }
        getNode() {
            return this.node_;
        }
    }
    /**
     * Given a set of raw changes (no moved events and prevName not specified yet), and a set of
     * EventRegistrations that should be notified of these changes, generate the actual events to be raised.
     *
     * Notes:
     *  - child_moved events will be synthesized at this time for any child_changed events that affect
     *    our index.
     *  - prevName will be calculated based on the index ordering.
     */
    function eventGeneratorGenerateEventsForChanges(eventGenerator, changes, eventCache, eventRegistrations) {
        const events = [];
        const moves = [];
        changes.forEach(change => {
            if (change.type === "child_changed" /* ChangeType.CHILD_CHANGED */ &&
                eventGenerator.index_.indexedValueChanged(change.oldSnap, change.snapshotNode)) {
                moves.push(changeChildMoved(change.childName, change.snapshotNode));
            }
        });
        eventGeneratorGenerateEventsForType(eventGenerator, events, "child_removed" /* ChangeType.CHILD_REMOVED */, changes, eventRegistrations, eventCache);
        eventGeneratorGenerateEventsForType(eventGenerator, events, "child_added" /* ChangeType.CHILD_ADDED */, changes, eventRegistrations, eventCache);
        eventGeneratorGenerateEventsForType(eventGenerator, events, "child_moved" /* ChangeType.CHILD_MOVED */, moves, eventRegistrations, eventCache);
        eventGeneratorGenerateEventsForType(eventGenerator, events, "child_changed" /* ChangeType.CHILD_CHANGED */, changes, eventRegistrations, eventCache);
        eventGeneratorGenerateEventsForType(eventGenerator, events, "value" /* ChangeType.VALUE */, changes, eventRegistrations, eventCache);
        return events;
    }
    /**
     * Given changes of a single change type, generate the corresponding events.
     */
    function eventGeneratorGenerateEventsForType(eventGenerator, events, eventType, changes, registrations, eventCache) {
        const filteredChanges = changes.filter(change => change.type === eventType);
        filteredChanges.sort((a, b) => eventGeneratorCompareChanges(eventGenerator, a, b));
        filteredChanges.forEach(change => {
            const materializedChange = eventGeneratorMaterializeSingleChange(eventGenerator, change, eventCache);
            registrations.forEach(registration => {
                if (registration.respondsTo(change.type)) {
                    events.push(registration.createEvent(materializedChange, eventGenerator.query_));
                }
            });
        });
    }
    function eventGeneratorMaterializeSingleChange(eventGenerator, change, eventCache) {
        if (change.type === 'value' || change.type === 'child_removed') {
            return change;
        }
        else {
            change.prevName = eventCache.getPredecessorChildName(change.childName, change.snapshotNode, eventGenerator.index_);
            return change;
        }
    }
    function eventGeneratorCompareChanges(eventGenerator, a, b) {
        if (a.childName == null || b.childName == null) {
            throw assertionError('Should only compare child_ events.');
        }
        const aWrapped = new NamedNode(a.childName, a.snapshotNode);
        const bWrapped = new NamedNode(b.childName, b.snapshotNode);
        return eventGenerator.index_.compare(aWrapped, bWrapped);
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function newViewCache(eventCache, serverCache) {
        return { eventCache, serverCache };
    }
    function viewCacheUpdateEventSnap(viewCache, eventSnap, complete, filtered) {
        return newViewCache(new CacheNode(eventSnap, complete, filtered), viewCache.serverCache);
    }
    function viewCacheUpdateServerSnap(viewCache, serverSnap, complete, filtered) {
        return newViewCache(viewCache.eventCache, new CacheNode(serverSnap, complete, filtered));
    }
    function viewCacheGetCompleteEventSnap(viewCache) {
        return viewCache.eventCache.isFullyInitialized()
            ? viewCache.eventCache.getNode()
            : null;
    }
    function viewCacheGetCompleteServerSnap(viewCache) {
        return viewCache.serverCache.isFullyInitialized()
            ? viewCache.serverCache.getNode()
            : null;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let emptyChildrenSingleton;
    /**
     * Singleton empty children collection.
     *
     */
    const EmptyChildren = () => {
        if (!emptyChildrenSingleton) {
            emptyChildrenSingleton = new SortedMap(stringCompare);
        }
        return emptyChildrenSingleton;
    };
    /**
     * A tree with immutable elements.
     */
    class ImmutableTree {
        constructor(value, children = EmptyChildren()) {
            this.value = value;
            this.children = children;
        }
        static fromObject(obj) {
            let tree = new ImmutableTree(null);
            each(obj, (childPath, childSnap) => {
                tree = tree.set(new Path(childPath), childSnap);
            });
            return tree;
        }
        /**
         * True if the value is empty and there are no children
         */
        isEmpty() {
            return this.value === null && this.children.isEmpty();
        }
        /**
         * Given a path and predicate, return the first node and the path to that node
         * where the predicate returns true.
         *
         * TODO Do a perf test -- If we're creating a bunch of `{path: value:}`
         * objects on the way back out, it may be better to pass down a pathSoFar obj.
         *
         * @param relativePath - The remainder of the path
         * @param predicate - The predicate to satisfy to return a node
         */
        findRootMostMatchingPathAndValue(relativePath, predicate) {
            if (this.value != null && predicate(this.value)) {
                return { path: newEmptyPath(), value: this.value };
            }
            else {
                if (pathIsEmpty(relativePath)) {
                    return null;
                }
                else {
                    const front = pathGetFront(relativePath);
                    const child = this.children.get(front);
                    if (child !== null) {
                        const childExistingPathAndValue = child.findRootMostMatchingPathAndValue(pathPopFront(relativePath), predicate);
                        if (childExistingPathAndValue != null) {
                            const fullPath = pathChild(new Path(front), childExistingPathAndValue.path);
                            return { path: fullPath, value: childExistingPathAndValue.value };
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        /**
         * Find, if it exists, the shortest subpath of the given path that points a defined
         * value in the tree
         */
        findRootMostValueAndPath(relativePath) {
            return this.findRootMostMatchingPathAndValue(relativePath, () => true);
        }
        /**
         * @returns The subtree at the given path
         */
        subtree(relativePath) {
            if (pathIsEmpty(relativePath)) {
                return this;
            }
            else {
                const front = pathGetFront(relativePath);
                const childTree = this.children.get(front);
                if (childTree !== null) {
                    return childTree.subtree(pathPopFront(relativePath));
                }
                else {
                    return new ImmutableTree(null);
                }
            }
        }
        /**
         * Sets a value at the specified path.
         *
         * @param relativePath - Path to set value at.
         * @param toSet - Value to set.
         * @returns Resulting tree.
         */
        set(relativePath, toSet) {
            if (pathIsEmpty(relativePath)) {
                return new ImmutableTree(toSet, this.children);
            }
            else {
                const front = pathGetFront(relativePath);
                const child = this.children.get(front) || new ImmutableTree(null);
                const newChild = child.set(pathPopFront(relativePath), toSet);
                const newChildren = this.children.insert(front, newChild);
                return new ImmutableTree(this.value, newChildren);
            }
        }
        /**
         * Removes the value at the specified path.
         *
         * @param relativePath - Path to value to remove.
         * @returns Resulting tree.
         */
        remove(relativePath) {
            if (pathIsEmpty(relativePath)) {
                if (this.children.isEmpty()) {
                    return new ImmutableTree(null);
                }
                else {
                    return new ImmutableTree(null, this.children);
                }
            }
            else {
                const front = pathGetFront(relativePath);
                const child = this.children.get(front);
                if (child) {
                    const newChild = child.remove(pathPopFront(relativePath));
                    let newChildren;
                    if (newChild.isEmpty()) {
                        newChildren = this.children.remove(front);
                    }
                    else {
                        newChildren = this.children.insert(front, newChild);
                    }
                    if (this.value === null && newChildren.isEmpty()) {
                        return new ImmutableTree(null);
                    }
                    else {
                        return new ImmutableTree(this.value, newChildren);
                    }
                }
                else {
                    return this;
                }
            }
        }
        /**
         * Gets a value from the tree.
         *
         * @param relativePath - Path to get value for.
         * @returns Value at path, or null.
         */
        get(relativePath) {
            if (pathIsEmpty(relativePath)) {
                return this.value;
            }
            else {
                const front = pathGetFront(relativePath);
                const child = this.children.get(front);
                if (child) {
                    return child.get(pathPopFront(relativePath));
                }
                else {
                    return null;
                }
            }
        }
        /**
         * Replace the subtree at the specified path with the given new tree.
         *
         * @param relativePath - Path to replace subtree for.
         * @param newTree - New tree.
         * @returns Resulting tree.
         */
        setTree(relativePath, newTree) {
            if (pathIsEmpty(relativePath)) {
                return newTree;
            }
            else {
                const front = pathGetFront(relativePath);
                const child = this.children.get(front) || new ImmutableTree(null);
                const newChild = child.setTree(pathPopFront(relativePath), newTree);
                let newChildren;
                if (newChild.isEmpty()) {
                    newChildren = this.children.remove(front);
                }
                else {
                    newChildren = this.children.insert(front, newChild);
                }
                return new ImmutableTree(this.value, newChildren);
            }
        }
        /**
         * Performs a depth first fold on this tree. Transforms a tree into a single
         * value, given a function that operates on the path to a node, an optional
         * current value, and a map of child names to folded subtrees
         */
        fold(fn) {
            return this.fold_(newEmptyPath(), fn);
        }
        /**
         * Recursive helper for public-facing fold() method
         */
        fold_(pathSoFar, fn) {
            const accum = {};
            this.children.inorderTraversal((childKey, childTree) => {
                accum[childKey] = childTree.fold_(pathChild(pathSoFar, childKey), fn);
            });
            return fn(pathSoFar, this.value, accum);
        }
        /**
         * Find the first matching value on the given path. Return the result of applying f to it.
         */
        findOnPath(path, f) {
            return this.findOnPath_(path, newEmptyPath(), f);
        }
        findOnPath_(pathToFollow, pathSoFar, f) {
            const result = this.value ? f(pathSoFar, this.value) : false;
            if (result) {
                return result;
            }
            else {
                if (pathIsEmpty(pathToFollow)) {
                    return null;
                }
                else {
                    const front = pathGetFront(pathToFollow);
                    const nextChild = this.children.get(front);
                    if (nextChild) {
                        return nextChild.findOnPath_(pathPopFront(pathToFollow), pathChild(pathSoFar, front), f);
                    }
                    else {
                        return null;
                    }
                }
            }
        }
        foreachOnPath(path, f) {
            return this.foreachOnPath_(path, newEmptyPath(), f);
        }
        foreachOnPath_(pathToFollow, currentRelativePath, f) {
            if (pathIsEmpty(pathToFollow)) {
                return this;
            }
            else {
                if (this.value) {
                    f(currentRelativePath, this.value);
                }
                const front = pathGetFront(pathToFollow);
                const nextChild = this.children.get(front);
                if (nextChild) {
                    return nextChild.foreachOnPath_(pathPopFront(pathToFollow), pathChild(currentRelativePath, front), f);
                }
                else {
                    return new ImmutableTree(null);
                }
            }
        }
        /**
         * Calls the given function for each node in the tree that has a value.
         *
         * @param f - A function to be called with the path from the root of the tree to
         * a node, and the value at that node. Called in depth-first order.
         */
        foreach(f) {
            this.foreach_(newEmptyPath(), f);
        }
        foreach_(currentRelativePath, f) {
            this.children.inorderTraversal((childName, childTree) => {
                childTree.foreach_(pathChild(currentRelativePath, childName), f);
            });
            if (this.value) {
                f(currentRelativePath, this.value);
            }
        }
        foreachChild(f) {
            this.children.inorderTraversal((childName, childTree) => {
                if (childTree.value) {
                    f(childName, childTree.value);
                }
            });
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * This class holds a collection of writes that can be applied to nodes in unison. It abstracts away the logic with
     * dealing with priority writes and multiple nested writes. At any given path there is only allowed to be one write
     * modifying that path. Any write to an existing path or shadowing an existing path will modify that existing write
     * to reflect the write added.
     */
    class CompoundWrite {
        constructor(writeTree_) {
            this.writeTree_ = writeTree_;
        }
        static empty() {
            return new CompoundWrite(new ImmutableTree(null));
        }
    }
    function compoundWriteAddWrite(compoundWrite, path, node) {
        if (pathIsEmpty(path)) {
            return new CompoundWrite(new ImmutableTree(node));
        }
        else {
            const rootmost = compoundWrite.writeTree_.findRootMostValueAndPath(path);
            if (rootmost != null) {
                const rootMostPath = rootmost.path;
                let value = rootmost.value;
                const relativePath = newRelativePath(rootMostPath, path);
                value = value.updateChild(relativePath, node);
                return new CompoundWrite(compoundWrite.writeTree_.set(rootMostPath, value));
            }
            else {
                const subtree = new ImmutableTree(node);
                const newWriteTree = compoundWrite.writeTree_.setTree(path, subtree);
                return new CompoundWrite(newWriteTree);
            }
        }
    }
    function compoundWriteAddWrites(compoundWrite, path, updates) {
        let newWrite = compoundWrite;
        each(updates, (childKey, node) => {
            newWrite = compoundWriteAddWrite(newWrite, pathChild(path, childKey), node);
        });
        return newWrite;
    }
    /**
     * Will remove a write at the given path and deeper paths. This will <em>not</em> modify a write at a higher
     * location, which must be removed by calling this method with that path.
     *
     * @param compoundWrite - The CompoundWrite to remove.
     * @param path - The path at which a write and all deeper writes should be removed
     * @returns The new CompoundWrite with the removed path
     */
    function compoundWriteRemoveWrite(compoundWrite, path) {
        if (pathIsEmpty(path)) {
            return CompoundWrite.empty();
        }
        else {
            const newWriteTree = compoundWrite.writeTree_.setTree(path, new ImmutableTree(null));
            return new CompoundWrite(newWriteTree);
        }
    }
    /**
     * Returns whether this CompoundWrite will fully overwrite a node at a given location and can therefore be
     * considered "complete".
     *
     * @param compoundWrite - The CompoundWrite to check.
     * @param path - The path to check for
     * @returns Whether there is a complete write at that path
     */
    function compoundWriteHasCompleteWrite(compoundWrite, path) {
        return compoundWriteGetCompleteNode(compoundWrite, path) != null;
    }
    /**
     * Returns a node for a path if and only if the node is a "complete" overwrite at that path. This will not aggregate
     * writes from deeper paths, but will return child nodes from a more shallow path.
     *
     * @param compoundWrite - The CompoundWrite to get the node from.
     * @param path - The path to get a complete write
     * @returns The node if complete at that path, or null otherwise.
     */
    function compoundWriteGetCompleteNode(compoundWrite, path) {
        const rootmost = compoundWrite.writeTree_.findRootMostValueAndPath(path);
        if (rootmost != null) {
            return compoundWrite.writeTree_
                .get(rootmost.path)
                .getChild(newRelativePath(rootmost.path, path));
        }
        else {
            return null;
        }
    }
    /**
     * Returns all children that are guaranteed to be a complete overwrite.
     *
     * @param compoundWrite - The CompoundWrite to get children from.
     * @returns A list of all complete children.
     */
    function compoundWriteGetCompleteChildren(compoundWrite) {
        const children = [];
        const node = compoundWrite.writeTree_.value;
        if (node != null) {
            // If it's a leaf node, it has no children; so nothing to do.
            if (!node.isLeafNode()) {
                node.forEachChild(PRIORITY_INDEX, (childName, childNode) => {
                    children.push(new NamedNode(childName, childNode));
                });
            }
        }
        else {
            compoundWrite.writeTree_.children.inorderTraversal((childName, childTree) => {
                if (childTree.value != null) {
                    children.push(new NamedNode(childName, childTree.value));
                }
            });
        }
        return children;
    }
    function compoundWriteChildCompoundWrite(compoundWrite, path) {
        if (pathIsEmpty(path)) {
            return compoundWrite;
        }
        else {
            const shadowingNode = compoundWriteGetCompleteNode(compoundWrite, path);
            if (shadowingNode != null) {
                return new CompoundWrite(new ImmutableTree(shadowingNode));
            }
            else {
                return new CompoundWrite(compoundWrite.writeTree_.subtree(path));
            }
        }
    }
    /**
     * Returns true if this CompoundWrite is empty and therefore does not modify any nodes.
     * @returns Whether this CompoundWrite is empty
     */
    function compoundWriteIsEmpty(compoundWrite) {
        return compoundWrite.writeTree_.isEmpty();
    }
    /**
     * Applies this CompoundWrite to a node. The node is returned with all writes from this CompoundWrite applied to the
     * node
     * @param node - The node to apply this CompoundWrite to
     * @returns The node with all writes applied
     */
    function compoundWriteApply(compoundWrite, node) {
        return applySubtreeWrite(newEmptyPath(), compoundWrite.writeTree_, node);
    }
    function applySubtreeWrite(relativePath, writeTree, node) {
        if (writeTree.value != null) {
            // Since there a write is always a leaf, we're done here
            return node.updateChild(relativePath, writeTree.value);
        }
        else {
            let priorityWrite = null;
            writeTree.children.inorderTraversal((childKey, childTree) => {
                if (childKey === '.priority') {
                    // Apply priorities at the end so we don't update priorities for either empty nodes or forget
                    // to apply priorities to empty nodes that are later filled
                    assert(childTree.value !== null, 'Priority writes must always be leaf nodes');
                    priorityWrite = childTree.value;
                }
                else {
                    node = applySubtreeWrite(pathChild(relativePath, childKey), childTree, node);
                }
            });
            // If there was a priority write, we only apply it if the node is not empty
            if (!node.getChild(relativePath).isEmpty() && priorityWrite !== null) {
                node = node.updateChild(pathChild(relativePath, '.priority'), priorityWrite);
            }
            return node;
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Create a new WriteTreeRef for the given path. For use with a new sync point at the given path.
     *
     */
    function writeTreeChildWrites(writeTree, path) {
        return newWriteTreeRef(path, writeTree);
    }
    /**
     * Record a new overwrite from user code.
     *
     * @param visible - This is set to false by some transactions. It should be excluded from event caches
     */
    function writeTreeAddOverwrite(writeTree, path, snap, writeId, visible) {
        assert(writeId > writeTree.lastWriteId, 'Stacking an older write on top of newer ones');
        if (visible === undefined) {
            visible = true;
        }
        writeTree.allWrites.push({
            path,
            snap,
            writeId,
            visible
        });
        if (visible) {
            writeTree.visibleWrites = compoundWriteAddWrite(writeTree.visibleWrites, path, snap);
        }
        writeTree.lastWriteId = writeId;
    }
    function writeTreeGetWrite(writeTree, writeId) {
        for (let i = 0; i < writeTree.allWrites.length; i++) {
            const record = writeTree.allWrites[i];
            if (record.writeId === writeId) {
                return record;
            }
        }
        return null;
    }
    /**
     * Remove a write (either an overwrite or merge) that has been successfully acknowledge by the server. Recalculates
     * the tree if necessary.  We return true if it may have been visible, meaning views need to reevaluate.
     *
     * @returns true if the write may have been visible (meaning we'll need to reevaluate / raise
     * events as a result).
     */
    function writeTreeRemoveWrite(writeTree, writeId) {
        // Note: disabling this check. It could be a transaction that preempted another transaction, and thus was applied
        // out of order.
        //const validClear = revert || this.allWrites_.length === 0 || writeId <= this.allWrites_[0].writeId;
        //assert(validClear, "Either we don't have this write, or it's the first one in the queue");
        const idx = writeTree.allWrites.findIndex(s => {
            return s.writeId === writeId;
        });
        assert(idx >= 0, 'removeWrite called with nonexistent writeId.');
        const writeToRemove = writeTree.allWrites[idx];
        writeTree.allWrites.splice(idx, 1);
        let removedWriteWasVisible = writeToRemove.visible;
        let removedWriteOverlapsWithOtherWrites = false;
        let i = writeTree.allWrites.length - 1;
        while (removedWriteWasVisible && i >= 0) {
            const currentWrite = writeTree.allWrites[i];
            if (currentWrite.visible) {
                if (i >= idx &&
                    writeTreeRecordContainsPath_(currentWrite, writeToRemove.path)) {
                    // The removed write was completely shadowed by a subsequent write.
                    removedWriteWasVisible = false;
                }
                else if (pathContains(writeToRemove.path, currentWrite.path)) {
                    // Either we're covering some writes or they're covering part of us (depending on which came first).
                    removedWriteOverlapsWithOtherWrites = true;
                }
            }
            i--;
        }
        if (!removedWriteWasVisible) {
            return false;
        }
        else if (removedWriteOverlapsWithOtherWrites) {
            // There's some shadowing going on. Just rebuild the visible writes from scratch.
            writeTreeResetTree_(writeTree);
            return true;
        }
        else {
            // There's no shadowing.  We can safely just remove the write(s) from visibleWrites.
            if (writeToRemove.snap) {
                writeTree.visibleWrites = compoundWriteRemoveWrite(writeTree.visibleWrites, writeToRemove.path);
            }
            else {
                const children = writeToRemove.children;
                each(children, (childName) => {
                    writeTree.visibleWrites = compoundWriteRemoveWrite(writeTree.visibleWrites, pathChild(writeToRemove.path, childName));
                });
            }
            return true;
        }
    }
    function writeTreeRecordContainsPath_(writeRecord, path) {
        if (writeRecord.snap) {
            return pathContains(writeRecord.path, path);
        }
        else {
            for (const childName in writeRecord.children) {
                if (writeRecord.children.hasOwnProperty(childName) &&
                    pathContains(pathChild(writeRecord.path, childName), path)) {
                    return true;
                }
            }
            return false;
        }
    }
    /**
     * Re-layer the writes and merges into a tree so we can efficiently calculate event snapshots
     */
    function writeTreeResetTree_(writeTree) {
        writeTree.visibleWrites = writeTreeLayerTree_(writeTree.allWrites, writeTreeDefaultFilter_, newEmptyPath());
        if (writeTree.allWrites.length > 0) {
            writeTree.lastWriteId =
                writeTree.allWrites[writeTree.allWrites.length - 1].writeId;
        }
        else {
            writeTree.lastWriteId = -1;
        }
    }
    /**
     * The default filter used when constructing the tree. Keep everything that's visible.
     */
    function writeTreeDefaultFilter_(write) {
        return write.visible;
    }
    /**
     * Static method. Given an array of WriteRecords, a filter for which ones to include, and a path, construct the tree of
     * event data at that path.
     */
    function writeTreeLayerTree_(writes, filter, treeRoot) {
        let compoundWrite = CompoundWrite.empty();
        for (let i = 0; i < writes.length; ++i) {
            const write = writes[i];
            // Theory, a later set will either:
            // a) abort a relevant transaction, so no need to worry about excluding it from calculating that transaction
            // b) not be relevant to a transaction (separate branch), so again will not affect the data for that transaction
            if (filter(write)) {
                const writePath = write.path;
                let relativePath;
                if (write.snap) {
                    if (pathContains(treeRoot, writePath)) {
                        relativePath = newRelativePath(treeRoot, writePath);
                        compoundWrite = compoundWriteAddWrite(compoundWrite, relativePath, write.snap);
                    }
                    else if (pathContains(writePath, treeRoot)) {
                        relativePath = newRelativePath(writePath, treeRoot);
                        compoundWrite = compoundWriteAddWrite(compoundWrite, newEmptyPath(), write.snap.getChild(relativePath));
                    }
                    else ;
                }
                else if (write.children) {
                    if (pathContains(treeRoot, writePath)) {
                        relativePath = newRelativePath(treeRoot, writePath);
                        compoundWrite = compoundWriteAddWrites(compoundWrite, relativePath, write.children);
                    }
                    else if (pathContains(writePath, treeRoot)) {
                        relativePath = newRelativePath(writePath, treeRoot);
                        if (pathIsEmpty(relativePath)) {
                            compoundWrite = compoundWriteAddWrites(compoundWrite, newEmptyPath(), write.children);
                        }
                        else {
                            const child = safeGet(write.children, pathGetFront(relativePath));
                            if (child) {
                                // There exists a child in this node that matches the root path
                                const deepNode = child.getChild(pathPopFront(relativePath));
                                compoundWrite = compoundWriteAddWrite(compoundWrite, newEmptyPath(), deepNode);
                            }
                        }
                    }
                    else ;
                }
                else {
                    throw assertionError('WriteRecord should have .snap or .children');
                }
            }
        }
        return compoundWrite;
    }
    /**
     * Given optional, underlying server data, and an optional set of constraints (exclude some sets, include hidden
     * writes), attempt to calculate a complete snapshot for the given path
     *
     * @param writeIdsToExclude - An optional set to be excluded
     * @param includeHiddenWrites - Defaults to false, whether or not to layer on writes with visible set to false
     */
    function writeTreeCalcCompleteEventCache(writeTree, treePath, completeServerCache, writeIdsToExclude, includeHiddenWrites) {
        if (!writeIdsToExclude && !includeHiddenWrites) {
            const shadowingNode = compoundWriteGetCompleteNode(writeTree.visibleWrites, treePath);
            if (shadowingNode != null) {
                return shadowingNode;
            }
            else {
                const subMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
                if (compoundWriteIsEmpty(subMerge)) {
                    return completeServerCache;
                }
                else if (completeServerCache == null &&
                    !compoundWriteHasCompleteWrite(subMerge, newEmptyPath())) {
                    // We wouldn't have a complete snapshot, since there's no underlying data and no complete shadow
                    return null;
                }
                else {
                    const layeredCache = completeServerCache || ChildrenNode.EMPTY_NODE;
                    return compoundWriteApply(subMerge, layeredCache);
                }
            }
        }
        else {
            const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
            if (!includeHiddenWrites && compoundWriteIsEmpty(merge)) {
                return completeServerCache;
            }
            else {
                // If the server cache is null, and we don't have a complete cache, we need to return null
                if (!includeHiddenWrites &&
                    completeServerCache == null &&
                    !compoundWriteHasCompleteWrite(merge, newEmptyPath())) {
                    return null;
                }
                else {
                    const filter = function (write) {
                        return ((write.visible || includeHiddenWrites) &&
                            (!writeIdsToExclude ||
                                !~writeIdsToExclude.indexOf(write.writeId)) &&
                            (pathContains(write.path, treePath) ||
                                pathContains(treePath, write.path)));
                    };
                    const mergeAtPath = writeTreeLayerTree_(writeTree.allWrites, filter, treePath);
                    const layeredCache = completeServerCache || ChildrenNode.EMPTY_NODE;
                    return compoundWriteApply(mergeAtPath, layeredCache);
                }
            }
        }
    }
    /**
     * With optional, underlying server data, attempt to return a children node of children that we have complete data for.
     * Used when creating new views, to pre-fill their complete event children snapshot.
     */
    function writeTreeCalcCompleteEventChildren(writeTree, treePath, completeServerChildren) {
        let completeChildren = ChildrenNode.EMPTY_NODE;
        const topLevelSet = compoundWriteGetCompleteNode(writeTree.visibleWrites, treePath);
        if (topLevelSet) {
            if (!topLevelSet.isLeafNode()) {
                // we're shadowing everything. Return the children.
                topLevelSet.forEachChild(PRIORITY_INDEX, (childName, childSnap) => {
                    completeChildren = completeChildren.updateImmediateChild(childName, childSnap);
                });
            }
            return completeChildren;
        }
        else if (completeServerChildren) {
            // Layer any children we have on top of this
            // We know we don't have a top-level set, so just enumerate existing children
            const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
            completeServerChildren.forEachChild(PRIORITY_INDEX, (childName, childNode) => {
                const node = compoundWriteApply(compoundWriteChildCompoundWrite(merge, new Path(childName)), childNode);
                completeChildren = completeChildren.updateImmediateChild(childName, node);
            });
            // Add any complete children we have from the set
            compoundWriteGetCompleteChildren(merge).forEach(namedNode => {
                completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
            });
            return completeChildren;
        }
        else {
            // We don't have anything to layer on top of. Layer on any children we have
            // Note that we can return an empty snap if we have a defined delete
            const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
            compoundWriteGetCompleteChildren(merge).forEach(namedNode => {
                completeChildren = completeChildren.updateImmediateChild(namedNode.name, namedNode.node);
            });
            return completeChildren;
        }
    }
    /**
     * Given that the underlying server data has updated, determine what, if anything, needs to be
     * applied to the event cache.
     *
     * Possibilities:
     *
     * 1. No writes are shadowing. Events should be raised, the snap to be applied comes from the server data
     *
     * 2. Some write is completely shadowing. No events to be raised
     *
     * 3. Is partially shadowed. Events
     *
     * Either existingEventSnap or existingServerSnap must exist
     */
    function writeTreeCalcEventCacheAfterServerOverwrite(writeTree, treePath, childPath, existingEventSnap, existingServerSnap) {
        assert(existingEventSnap || existingServerSnap, 'Either existingEventSnap or existingServerSnap must exist');
        const path = pathChild(treePath, childPath);
        if (compoundWriteHasCompleteWrite(writeTree.visibleWrites, path)) {
            // At this point we can probably guarantee that we're in case 2, meaning no events
            // May need to check visibility while doing the findRootMostValueAndPath call
            return null;
        }
        else {
            // No complete shadowing. We're either partially shadowing or not shadowing at all.
            const childMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, path);
            if (compoundWriteIsEmpty(childMerge)) {
                // We're not shadowing at all. Case 1
                return existingServerSnap.getChild(childPath);
            }
            else {
                // This could be more efficient if the serverNode + updates doesn't change the eventSnap
                // However this is tricky to find out, since user updates don't necessary change the server
                // snap, e.g. priority updates on empty nodes, or deep deletes. Another special case is if the server
                // adds nodes, but doesn't change any existing writes. It is therefore not enough to
                // only check if the updates change the serverNode.
                // Maybe check if the merge tree contains these special cases and only do a full overwrite in that case?
                return compoundWriteApply(childMerge, existingServerSnap.getChild(childPath));
            }
        }
    }
    /**
     * Returns a complete child for a given server snap after applying all user writes or null if there is no
     * complete child for this ChildKey.
     */
    function writeTreeCalcCompleteChild(writeTree, treePath, childKey, existingServerSnap) {
        const path = pathChild(treePath, childKey);
        const shadowingNode = compoundWriteGetCompleteNode(writeTree.visibleWrites, path);
        if (shadowingNode != null) {
            return shadowingNode;
        }
        else {
            if (existingServerSnap.isCompleteForChild(childKey)) {
                const childMerge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, path);
                return compoundWriteApply(childMerge, existingServerSnap.getNode().getImmediateChild(childKey));
            }
            else {
                return null;
            }
        }
    }
    /**
     * Returns a node if there is a complete overwrite for this path. More specifically, if there is a write at
     * a higher path, this will return the child of that write relative to the write and this path.
     * Returns null if there is no write at this path.
     */
    function writeTreeShadowingWrite(writeTree, path) {
        return compoundWriteGetCompleteNode(writeTree.visibleWrites, path);
    }
    /**
     * This method is used when processing child remove events on a query. If we can, we pull in children that were outside
     * the window, but may now be in the window.
     */
    function writeTreeCalcIndexedSlice(writeTree, treePath, completeServerData, startPost, count, reverse, index) {
        let toIterate;
        const merge = compoundWriteChildCompoundWrite(writeTree.visibleWrites, treePath);
        const shadowingNode = compoundWriteGetCompleteNode(merge, newEmptyPath());
        if (shadowingNode != null) {
            toIterate = shadowingNode;
        }
        else if (completeServerData != null) {
            toIterate = compoundWriteApply(merge, completeServerData);
        }
        else {
            // no children to iterate on
            return [];
        }
        toIterate = toIterate.withIndex(index);
        if (!toIterate.isEmpty() && !toIterate.isLeafNode()) {
            const nodes = [];
            const cmp = index.getCompare();
            const iter = reverse
                ? toIterate.getReverseIteratorFrom(startPost, index)
                : toIterate.getIteratorFrom(startPost, index);
            let next = iter.getNext();
            while (next && nodes.length < count) {
                if (cmp(next, startPost) !== 0) {
                    nodes.push(next);
                }
                next = iter.getNext();
            }
            return nodes;
        }
        else {
            return [];
        }
    }
    function newWriteTree() {
        return {
            visibleWrites: CompoundWrite.empty(),
            allWrites: [],
            lastWriteId: -1
        };
    }
    /**
     * If possible, returns a complete event cache, using the underlying server data if possible. In addition, can be used
     * to get a cache that includes hidden writes, and excludes arbitrary writes. Note that customizing the returned node
     * can lead to a more expensive calculation.
     *
     * @param writeIdsToExclude - Optional writes to exclude.
     * @param includeHiddenWrites - Defaults to false, whether or not to layer on writes with visible set to false
     */
    function writeTreeRefCalcCompleteEventCache(writeTreeRef, completeServerCache, writeIdsToExclude, includeHiddenWrites) {
        return writeTreeCalcCompleteEventCache(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerCache, writeIdsToExclude, includeHiddenWrites);
    }
    /**
     * If possible, returns a children node containing all of the complete children we have data for. The returned data is a
     * mix of the given server data and write data.
     *
     */
    function writeTreeRefCalcCompleteEventChildren(writeTreeRef, completeServerChildren) {
        return writeTreeCalcCompleteEventChildren(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerChildren);
    }
    /**
     * Given that either the underlying server data has updated or the outstanding writes have updated, determine what,
     * if anything, needs to be applied to the event cache.
     *
     * Possibilities:
     *
     * 1. No writes are shadowing. Events should be raised, the snap to be applied comes from the server data
     *
     * 2. Some write is completely shadowing. No events to be raised
     *
     * 3. Is partially shadowed. Events should be raised
     *
     * Either existingEventSnap or existingServerSnap must exist, this is validated via an assert
     *
     *
     */
    function writeTreeRefCalcEventCacheAfterServerOverwrite(writeTreeRef, path, existingEventSnap, existingServerSnap) {
        return writeTreeCalcEventCacheAfterServerOverwrite(writeTreeRef.writeTree, writeTreeRef.treePath, path, existingEventSnap, existingServerSnap);
    }
    /**
     * Returns a node if there is a complete overwrite for this path. More specifically, if there is a write at
     * a higher path, this will return the child of that write relative to the write and this path.
     * Returns null if there is no write at this path.
     *
     */
    function writeTreeRefShadowingWrite(writeTreeRef, path) {
        return writeTreeShadowingWrite(writeTreeRef.writeTree, pathChild(writeTreeRef.treePath, path));
    }
    /**
     * This method is used when processing child remove events on a query. If we can, we pull in children that were outside
     * the window, but may now be in the window
     */
    function writeTreeRefCalcIndexedSlice(writeTreeRef, completeServerData, startPost, count, reverse, index) {
        return writeTreeCalcIndexedSlice(writeTreeRef.writeTree, writeTreeRef.treePath, completeServerData, startPost, count, reverse, index);
    }
    /**
     * Returns a complete child for a given server snap after applying all user writes or null if there is no
     * complete child for this ChildKey.
     */
    function writeTreeRefCalcCompleteChild(writeTreeRef, childKey, existingServerCache) {
        return writeTreeCalcCompleteChild(writeTreeRef.writeTree, writeTreeRef.treePath, childKey, existingServerCache);
    }
    /**
     * Return a WriteTreeRef for a child.
     */
    function writeTreeRefChild(writeTreeRef, childName) {
        return newWriteTreeRef(pathChild(writeTreeRef.treePath, childName), writeTreeRef.writeTree);
    }
    function newWriteTreeRef(path, writeTree) {
        return {
            treePath: path,
            writeTree
        };
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class ChildChangeAccumulator {
        constructor() {
            this.changeMap = new Map();
        }
        trackChildChange(change) {
            const type = change.type;
            const childKey = change.childName;
            assert(type === "child_added" /* ChangeType.CHILD_ADDED */ ||
                type === "child_changed" /* ChangeType.CHILD_CHANGED */ ||
                type === "child_removed" /* ChangeType.CHILD_REMOVED */, 'Only child changes supported for tracking');
            assert(childKey !== '.priority', 'Only non-priority child changes can be tracked.');
            const oldChange = this.changeMap.get(childKey);
            if (oldChange) {
                const oldType = oldChange.type;
                if (type === "child_added" /* ChangeType.CHILD_ADDED */ &&
                    oldType === "child_removed" /* ChangeType.CHILD_REMOVED */) {
                    this.changeMap.set(childKey, changeChildChanged(childKey, change.snapshotNode, oldChange.snapshotNode));
                }
                else if (type === "child_removed" /* ChangeType.CHILD_REMOVED */ &&
                    oldType === "child_added" /* ChangeType.CHILD_ADDED */) {
                    this.changeMap.delete(childKey);
                }
                else if (type === "child_removed" /* ChangeType.CHILD_REMOVED */ &&
                    oldType === "child_changed" /* ChangeType.CHILD_CHANGED */) {
                    this.changeMap.set(childKey, changeChildRemoved(childKey, oldChange.oldSnap));
                }
                else if (type === "child_changed" /* ChangeType.CHILD_CHANGED */ &&
                    oldType === "child_added" /* ChangeType.CHILD_ADDED */) {
                    this.changeMap.set(childKey, changeChildAdded(childKey, change.snapshotNode));
                }
                else if (type === "child_changed" /* ChangeType.CHILD_CHANGED */ &&
                    oldType === "child_changed" /* ChangeType.CHILD_CHANGED */) {
                    this.changeMap.set(childKey, changeChildChanged(childKey, change.snapshotNode, oldChange.oldSnap));
                }
                else {
                    throw assertionError('Illegal combination of changes: ' +
                        change +
                        ' occurred after ' +
                        oldChange);
                }
            }
            else {
                this.changeMap.set(childKey, change);
            }
        }
        getChanges() {
            return Array.from(this.changeMap.values());
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * An implementation of CompleteChildSource that never returns any additional children
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    class NoCompleteChildSource_ {
        getCompleteChild(childKey) {
            return null;
        }
        getChildAfterChild(index, child, reverse) {
            return null;
        }
    }
    /**
     * Singleton instance.
     */
    const NO_COMPLETE_CHILD_SOURCE = new NoCompleteChildSource_();
    /**
     * An implementation of CompleteChildSource that uses a WriteTree in addition to any other server data or
     * old event caches available to calculate complete children.
     */
    class WriteTreeCompleteChildSource {
        constructor(writes_, viewCache_, optCompleteServerCache_ = null) {
            this.writes_ = writes_;
            this.viewCache_ = viewCache_;
            this.optCompleteServerCache_ = optCompleteServerCache_;
        }
        getCompleteChild(childKey) {
            const node = this.viewCache_.eventCache;
            if (node.isCompleteForChild(childKey)) {
                return node.getNode().getImmediateChild(childKey);
            }
            else {
                const serverNode = this.optCompleteServerCache_ != null
                    ? new CacheNode(this.optCompleteServerCache_, true, false)
                    : this.viewCache_.serverCache;
                return writeTreeRefCalcCompleteChild(this.writes_, childKey, serverNode);
            }
        }
        getChildAfterChild(index, child, reverse) {
            const completeServerData = this.optCompleteServerCache_ != null
                ? this.optCompleteServerCache_
                : viewCacheGetCompleteServerSnap(this.viewCache_);
            const nodes = writeTreeRefCalcIndexedSlice(this.writes_, completeServerData, child, 1, reverse, index);
            if (nodes.length === 0) {
                return null;
            }
            else {
                return nodes[0];
            }
        }
    }
    function viewProcessorAssertIndexed(viewProcessor, viewCache) {
        assert(viewCache.eventCache.getNode().isIndexed(viewProcessor.filter.getIndex()), 'Event snap not indexed');
        assert(viewCache.serverCache.getNode().isIndexed(viewProcessor.filter.getIndex()), 'Server snap not indexed');
    }
    function viewProcessorApplyOperation(viewProcessor, oldViewCache, operation, writesCache, completeCache) {
        const accumulator = new ChildChangeAccumulator();
        let newViewCache, filterServerNode;
        if (operation.type === OperationType.OVERWRITE) {
            const overwrite = operation;
            if (overwrite.source.fromUser) {
                newViewCache = viewProcessorApplyUserOverwrite(viewProcessor, oldViewCache, overwrite.path, overwrite.snap, writesCache, completeCache, accumulator);
            }
            else {
                assert(overwrite.source.fromServer, 'Unknown source.');
                // We filter the node if it's a tagged update or the node has been previously filtered  and the
                // update is not at the root in which case it is ok (and necessary) to mark the node unfiltered
                // again
                filterServerNode =
                    overwrite.source.tagged ||
                        (oldViewCache.serverCache.isFiltered() && !pathIsEmpty(overwrite.path));
                newViewCache = viewProcessorApplyServerOverwrite(viewProcessor, oldViewCache, overwrite.path, overwrite.snap, writesCache, completeCache, filterServerNode, accumulator);
            }
        }
        else if (operation.type === OperationType.MERGE) {
            const merge = operation;
            if (merge.source.fromUser) {
                newViewCache = viewProcessorApplyUserMerge(viewProcessor, oldViewCache, merge.path, merge.children, writesCache, completeCache, accumulator);
            }
            else {
                assert(merge.source.fromServer, 'Unknown source.');
                // We filter the node if it's a tagged update or the node has been previously filtered
                filterServerNode =
                    merge.source.tagged || oldViewCache.serverCache.isFiltered();
                newViewCache = viewProcessorApplyServerMerge(viewProcessor, oldViewCache, merge.path, merge.children, writesCache, completeCache, filterServerNode, accumulator);
            }
        }
        else if (operation.type === OperationType.ACK_USER_WRITE) {
            const ackUserWrite = operation;
            if (!ackUserWrite.revert) {
                newViewCache = viewProcessorAckUserWrite(viewProcessor, oldViewCache, ackUserWrite.path, ackUserWrite.affectedTree, writesCache, completeCache, accumulator);
            }
            else {
                newViewCache = viewProcessorRevertUserWrite(viewProcessor, oldViewCache, ackUserWrite.path, writesCache, completeCache, accumulator);
            }
        }
        else if (operation.type === OperationType.LISTEN_COMPLETE) {
            newViewCache = viewProcessorListenComplete(viewProcessor, oldViewCache, operation.path, writesCache, accumulator);
        }
        else {
            throw assertionError('Unknown operation type: ' + operation.type);
        }
        const changes = accumulator.getChanges();
        viewProcessorMaybeAddValueEvent(oldViewCache, newViewCache, changes);
        return { viewCache: newViewCache, changes };
    }
    function viewProcessorMaybeAddValueEvent(oldViewCache, newViewCache, accumulator) {
        const eventSnap = newViewCache.eventCache;
        if (eventSnap.isFullyInitialized()) {
            const isLeafOrEmpty = eventSnap.getNode().isLeafNode() || eventSnap.getNode().isEmpty();
            const oldCompleteSnap = viewCacheGetCompleteEventSnap(oldViewCache);
            if (accumulator.length > 0 ||
                !oldViewCache.eventCache.isFullyInitialized() ||
                (isLeafOrEmpty && !eventSnap.getNode().equals(oldCompleteSnap)) ||
                !eventSnap.getNode().getPriority().equals(oldCompleteSnap.getPriority())) {
                accumulator.push(changeValue(viewCacheGetCompleteEventSnap(newViewCache)));
            }
        }
    }
    function viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, viewCache, changePath, writesCache, source, accumulator) {
        const oldEventSnap = viewCache.eventCache;
        if (writeTreeRefShadowingWrite(writesCache, changePath) != null) {
            // we have a shadowing write, ignore changes
            return viewCache;
        }
        else {
            let newEventCache, serverNode;
            if (pathIsEmpty(changePath)) {
                // TODO: figure out how this plays with "sliding ack windows"
                assert(viewCache.serverCache.isFullyInitialized(), 'If change path is empty, we must have complete server data');
                if (viewCache.serverCache.isFiltered()) {
                    // We need to special case this, because we need to only apply writes to complete children, or
                    // we might end up raising events for incomplete children. If the server data is filtered deep
                    // writes cannot be guaranteed to be complete
                    const serverCache = viewCacheGetCompleteServerSnap(viewCache);
                    const completeChildren = serverCache instanceof ChildrenNode
                        ? serverCache
                        : ChildrenNode.EMPTY_NODE;
                    const completeEventChildren = writeTreeRefCalcCompleteEventChildren(writesCache, completeChildren);
                    newEventCache = viewProcessor.filter.updateFullNode(viewCache.eventCache.getNode(), completeEventChildren, accumulator);
                }
                else {
                    const completeNode = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
                    newEventCache = viewProcessor.filter.updateFullNode(viewCache.eventCache.getNode(), completeNode, accumulator);
                }
            }
            else {
                const childKey = pathGetFront(changePath);
                if (childKey === '.priority') {
                    assert(pathGetLength(changePath) === 1, "Can't have a priority with additional path components");
                    const oldEventNode = oldEventSnap.getNode();
                    serverNode = viewCache.serverCache.getNode();
                    // we might have overwrites for this priority
                    const updatedPriority = writeTreeRefCalcEventCacheAfterServerOverwrite(writesCache, changePath, oldEventNode, serverNode);
                    if (updatedPriority != null) {
                        newEventCache = viewProcessor.filter.updatePriority(oldEventNode, updatedPriority);
                    }
                    else {
                        // priority didn't change, keep old node
                        newEventCache = oldEventSnap.getNode();
                    }
                }
                else {
                    const childChangePath = pathPopFront(changePath);
                    // update child
                    let newEventChild;
                    if (oldEventSnap.isCompleteForChild(childKey)) {
                        serverNode = viewCache.serverCache.getNode();
                        const eventChildUpdate = writeTreeRefCalcEventCacheAfterServerOverwrite(writesCache, changePath, oldEventSnap.getNode(), serverNode);
                        if (eventChildUpdate != null) {
                            newEventChild = oldEventSnap
                                .getNode()
                                .getImmediateChild(childKey)
                                .updateChild(childChangePath, eventChildUpdate);
                        }
                        else {
                            // Nothing changed, just keep the old child
                            newEventChild = oldEventSnap.getNode().getImmediateChild(childKey);
                        }
                    }
                    else {
                        newEventChild = writeTreeRefCalcCompleteChild(writesCache, childKey, viewCache.serverCache);
                    }
                    if (newEventChild != null) {
                        newEventCache = viewProcessor.filter.updateChild(oldEventSnap.getNode(), childKey, newEventChild, childChangePath, source, accumulator);
                    }
                    else {
                        // no complete child available or no change
                        newEventCache = oldEventSnap.getNode();
                    }
                }
            }
            return viewCacheUpdateEventSnap(viewCache, newEventCache, oldEventSnap.isFullyInitialized() || pathIsEmpty(changePath), viewProcessor.filter.filtersNodes());
        }
    }
    function viewProcessorApplyServerOverwrite(viewProcessor, oldViewCache, changePath, changedSnap, writesCache, completeCache, filterServerNode, accumulator) {
        const oldServerSnap = oldViewCache.serverCache;
        let newServerCache;
        const serverFilter = filterServerNode
            ? viewProcessor.filter
            : viewProcessor.filter.getIndexedFilter();
        if (pathIsEmpty(changePath)) {
            newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), changedSnap, null);
        }
        else if (serverFilter.filtersNodes() && !oldServerSnap.isFiltered()) {
            // we want to filter the server node, but we didn't filter the server node yet, so simulate a full update
            const newServerNode = oldServerSnap
                .getNode()
                .updateChild(changePath, changedSnap);
            newServerCache = serverFilter.updateFullNode(oldServerSnap.getNode(), newServerNode, null);
        }
        else {
            const childKey = pathGetFront(changePath);
            if (!oldServerSnap.isCompleteForPath(changePath) &&
                pathGetLength(changePath) > 1) {
                // We don't update incomplete nodes with updates intended for other listeners
                return oldViewCache;
            }
            const childChangePath = pathPopFront(changePath);
            const childNode = oldServerSnap.getNode().getImmediateChild(childKey);
            const newChildNode = childNode.updateChild(childChangePath, changedSnap);
            if (childKey === '.priority') {
                newServerCache = serverFilter.updatePriority(oldServerSnap.getNode(), newChildNode);
            }
            else {
                newServerCache = serverFilter.updateChild(oldServerSnap.getNode(), childKey, newChildNode, childChangePath, NO_COMPLETE_CHILD_SOURCE, null);
            }
        }
        const newViewCache = viewCacheUpdateServerSnap(oldViewCache, newServerCache, oldServerSnap.isFullyInitialized() || pathIsEmpty(changePath), serverFilter.filtersNodes());
        const source = new WriteTreeCompleteChildSource(writesCache, newViewCache, completeCache);
        return viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, newViewCache, changePath, writesCache, source, accumulator);
    }
    function viewProcessorApplyUserOverwrite(viewProcessor, oldViewCache, changePath, changedSnap, writesCache, completeCache, accumulator) {
        const oldEventSnap = oldViewCache.eventCache;
        let newViewCache, newEventCache;
        const source = new WriteTreeCompleteChildSource(writesCache, oldViewCache, completeCache);
        if (pathIsEmpty(changePath)) {
            newEventCache = viewProcessor.filter.updateFullNode(oldViewCache.eventCache.getNode(), changedSnap, accumulator);
            newViewCache = viewCacheUpdateEventSnap(oldViewCache, newEventCache, true, viewProcessor.filter.filtersNodes());
        }
        else {
            const childKey = pathGetFront(changePath);
            if (childKey === '.priority') {
                newEventCache = viewProcessor.filter.updatePriority(oldViewCache.eventCache.getNode(), changedSnap);
                newViewCache = viewCacheUpdateEventSnap(oldViewCache, newEventCache, oldEventSnap.isFullyInitialized(), oldEventSnap.isFiltered());
            }
            else {
                const childChangePath = pathPopFront(changePath);
                const oldChild = oldEventSnap.getNode().getImmediateChild(childKey);
                let newChild;
                if (pathIsEmpty(childChangePath)) {
                    // Child overwrite, we can replace the child
                    newChild = changedSnap;
                }
                else {
                    const childNode = source.getCompleteChild(childKey);
                    if (childNode != null) {
                        if (pathGetBack(childChangePath) === '.priority' &&
                            childNode.getChild(pathParent(childChangePath)).isEmpty()) {
                            // This is a priority update on an empty node. If this node exists on the server, the
                            // server will send down the priority in the update, so ignore for now
                            newChild = childNode;
                        }
                        else {
                            newChild = childNode.updateChild(childChangePath, changedSnap);
                        }
                    }
                    else {
                        // There is no complete child node available
                        newChild = ChildrenNode.EMPTY_NODE;
                    }
                }
                if (!oldChild.equals(newChild)) {
                    const newEventSnap = viewProcessor.filter.updateChild(oldEventSnap.getNode(), childKey, newChild, childChangePath, source, accumulator);
                    newViewCache = viewCacheUpdateEventSnap(oldViewCache, newEventSnap, oldEventSnap.isFullyInitialized(), viewProcessor.filter.filtersNodes());
                }
                else {
                    newViewCache = oldViewCache;
                }
            }
        }
        return newViewCache;
    }
    function viewProcessorCacheHasChild(viewCache, childKey) {
        return viewCache.eventCache.isCompleteForChild(childKey);
    }
    function viewProcessorApplyUserMerge(viewProcessor, viewCache, path, changedChildren, writesCache, serverCache, accumulator) {
        // HACK: In the case of a limit query, there may be some changes that bump things out of the
        // window leaving room for new items.  It's important we process these changes first, so we
        // iterate the changes twice, first processing any that affect items currently in view.
        // TODO: I consider an item "in view" if cacheHasChild is true, which checks both the server
        // and event snap.  I'm not sure if this will result in edge cases when a child is in one but
        // not the other.
        let curViewCache = viewCache;
        changedChildren.foreach((relativePath, childNode) => {
            const writePath = pathChild(path, relativePath);
            if (viewProcessorCacheHasChild(viewCache, pathGetFront(writePath))) {
                curViewCache = viewProcessorApplyUserOverwrite(viewProcessor, curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
            }
        });
        changedChildren.foreach((relativePath, childNode) => {
            const writePath = pathChild(path, relativePath);
            if (!viewProcessorCacheHasChild(viewCache, pathGetFront(writePath))) {
                curViewCache = viewProcessorApplyUserOverwrite(viewProcessor, curViewCache, writePath, childNode, writesCache, serverCache, accumulator);
            }
        });
        return curViewCache;
    }
    function viewProcessorApplyMerge(viewProcessor, node, merge) {
        merge.foreach((relativePath, childNode) => {
            node = node.updateChild(relativePath, childNode);
        });
        return node;
    }
    function viewProcessorApplyServerMerge(viewProcessor, viewCache, path, changedChildren, writesCache, serverCache, filterServerNode, accumulator) {
        // If we don't have a cache yet, this merge was intended for a previously listen in the same location. Ignore it and
        // wait for the complete data update coming soon.
        if (viewCache.serverCache.getNode().isEmpty() &&
            !viewCache.serverCache.isFullyInitialized()) {
            return viewCache;
        }
        // HACK: In the case of a limit query, there may be some changes that bump things out of the
        // window leaving room for new items.  It's important we process these changes first, so we
        // iterate the changes twice, first processing any that affect items currently in view.
        // TODO: I consider an item "in view" if cacheHasChild is true, which checks both the server
        // and event snap.  I'm not sure if this will result in edge cases when a child is in one but
        // not the other.
        let curViewCache = viewCache;
        let viewMergeTree;
        if (pathIsEmpty(path)) {
            viewMergeTree = changedChildren;
        }
        else {
            viewMergeTree = new ImmutableTree(null).setTree(path, changedChildren);
        }
        const serverNode = viewCache.serverCache.getNode();
        viewMergeTree.children.inorderTraversal((childKey, childTree) => {
            if (serverNode.hasChild(childKey)) {
                const serverChild = viewCache.serverCache
                    .getNode()
                    .getImmediateChild(childKey);
                const newChild = viewProcessorApplyMerge(viewProcessor, serverChild, childTree);
                curViewCache = viewProcessorApplyServerOverwrite(viewProcessor, curViewCache, new Path(childKey), newChild, writesCache, serverCache, filterServerNode, accumulator);
            }
        });
        viewMergeTree.children.inorderTraversal((childKey, childMergeTree) => {
            const isUnknownDeepMerge = !viewCache.serverCache.isCompleteForChild(childKey) &&
                childMergeTree.value === null;
            if (!serverNode.hasChild(childKey) && !isUnknownDeepMerge) {
                const serverChild = viewCache.serverCache
                    .getNode()
                    .getImmediateChild(childKey);
                const newChild = viewProcessorApplyMerge(viewProcessor, serverChild, childMergeTree);
                curViewCache = viewProcessorApplyServerOverwrite(viewProcessor, curViewCache, new Path(childKey), newChild, writesCache, serverCache, filterServerNode, accumulator);
            }
        });
        return curViewCache;
    }
    function viewProcessorAckUserWrite(viewProcessor, viewCache, ackPath, affectedTree, writesCache, completeCache, accumulator) {
        if (writeTreeRefShadowingWrite(writesCache, ackPath) != null) {
            return viewCache;
        }
        // Only filter server node if it is currently filtered
        const filterServerNode = viewCache.serverCache.isFiltered();
        // Essentially we'll just get our existing server cache for the affected paths and re-apply it as a server update
        // now that it won't be shadowed.
        const serverCache = viewCache.serverCache;
        if (affectedTree.value != null) {
            // This is an overwrite.
            if ((pathIsEmpty(ackPath) && serverCache.isFullyInitialized()) ||
                serverCache.isCompleteForPath(ackPath)) {
                return viewProcessorApplyServerOverwrite(viewProcessor, viewCache, ackPath, serverCache.getNode().getChild(ackPath), writesCache, completeCache, filterServerNode, accumulator);
            }
            else if (pathIsEmpty(ackPath)) {
                // This is a goofy edge case where we are acking data at this location but don't have full data.  We
                // should just re-apply whatever we have in our cache as a merge.
                let changedChildren = new ImmutableTree(null);
                serverCache.getNode().forEachChild(KEY_INDEX, (name, node) => {
                    changedChildren = changedChildren.set(new Path(name), node);
                });
                return viewProcessorApplyServerMerge(viewProcessor, viewCache, ackPath, changedChildren, writesCache, completeCache, filterServerNode, accumulator);
            }
            else {
                return viewCache;
            }
        }
        else {
            // This is a merge.
            let changedChildren = new ImmutableTree(null);
            affectedTree.foreach((mergePath, value) => {
                const serverCachePath = pathChild(ackPath, mergePath);
                if (serverCache.isCompleteForPath(serverCachePath)) {
                    changedChildren = changedChildren.set(mergePath, serverCache.getNode().getChild(serverCachePath));
                }
            });
            return viewProcessorApplyServerMerge(viewProcessor, viewCache, ackPath, changedChildren, writesCache, completeCache, filterServerNode, accumulator);
        }
    }
    function viewProcessorListenComplete(viewProcessor, viewCache, path, writesCache, accumulator) {
        const oldServerNode = viewCache.serverCache;
        const newViewCache = viewCacheUpdateServerSnap(viewCache, oldServerNode.getNode(), oldServerNode.isFullyInitialized() || pathIsEmpty(path), oldServerNode.isFiltered());
        return viewProcessorGenerateEventCacheAfterServerEvent(viewProcessor, newViewCache, path, writesCache, NO_COMPLETE_CHILD_SOURCE, accumulator);
    }
    function viewProcessorRevertUserWrite(viewProcessor, viewCache, path, writesCache, completeServerCache, accumulator) {
        let complete;
        if (writeTreeRefShadowingWrite(writesCache, path) != null) {
            return viewCache;
        }
        else {
            const source = new WriteTreeCompleteChildSource(writesCache, viewCache, completeServerCache);
            const oldEventCache = viewCache.eventCache.getNode();
            let newEventCache;
            if (pathIsEmpty(path) || pathGetFront(path) === '.priority') {
                let newNode;
                if (viewCache.serverCache.isFullyInitialized()) {
                    newNode = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
                }
                else {
                    const serverChildren = viewCache.serverCache.getNode();
                    assert(serverChildren instanceof ChildrenNode, 'serverChildren would be complete if leaf node');
                    newNode = writeTreeRefCalcCompleteEventChildren(writesCache, serverChildren);
                }
                newNode = newNode;
                newEventCache = viewProcessor.filter.updateFullNode(oldEventCache, newNode, accumulator);
            }
            else {
                const childKey = pathGetFront(path);
                let newChild = writeTreeRefCalcCompleteChild(writesCache, childKey, viewCache.serverCache);
                if (newChild == null &&
                    viewCache.serverCache.isCompleteForChild(childKey)) {
                    newChild = oldEventCache.getImmediateChild(childKey);
                }
                if (newChild != null) {
                    newEventCache = viewProcessor.filter.updateChild(oldEventCache, childKey, newChild, pathPopFront(path), source, accumulator);
                }
                else if (viewCache.eventCache.getNode().hasChild(childKey)) {
                    // No complete child available, delete the existing one, if any
                    newEventCache = viewProcessor.filter.updateChild(oldEventCache, childKey, ChildrenNode.EMPTY_NODE, pathPopFront(path), source, accumulator);
                }
                else {
                    newEventCache = oldEventCache;
                }
                if (newEventCache.isEmpty() &&
                    viewCache.serverCache.isFullyInitialized()) {
                    // We might have reverted all child writes. Maybe the old event was a leaf node
                    complete = writeTreeRefCalcCompleteEventCache(writesCache, viewCacheGetCompleteServerSnap(viewCache));
                    if (complete.isLeafNode()) {
                        newEventCache = viewProcessor.filter.updateFullNode(newEventCache, complete, accumulator);
                    }
                }
            }
            complete =
                viewCache.serverCache.isFullyInitialized() ||
                    writeTreeRefShadowingWrite(writesCache, newEmptyPath()) != null;
            return viewCacheUpdateEventSnap(viewCache, newEventCache, complete, viewProcessor.filter.filtersNodes());
        }
    }
    function viewGetCompleteServerCache(view, path) {
        const cache = viewCacheGetCompleteServerSnap(view.viewCache_);
        if (cache) {
            // If this isn't a "loadsAllData" view, then cache isn't actually a complete cache and
            // we need to see if it contains the child we're interested in.
            if (view.query._queryParams.loadsAllData() ||
                (!pathIsEmpty(path) &&
                    !cache.getImmediateChild(pathGetFront(path)).isEmpty())) {
                return cache.getChild(path);
            }
        }
        return null;
    }
    /**
     * Applies the given Operation, updates our cache, and returns the appropriate events.
     */
    function viewApplyOperation(view, operation, writesCache, completeServerCache) {
        if (operation.type === OperationType.MERGE &&
            operation.source.queryId !== null) {
            assert(viewCacheGetCompleteServerSnap(view.viewCache_), 'We should always have a full cache before handling merges');
            assert(viewCacheGetCompleteEventSnap(view.viewCache_), 'Missing event cache, even though we have a server cache');
        }
        const oldViewCache = view.viewCache_;
        const result = viewProcessorApplyOperation(view.processor_, oldViewCache, operation, writesCache, completeServerCache);
        viewProcessorAssertIndexed(view.processor_, result.viewCache);
        assert(result.viewCache.serverCache.isFullyInitialized() ||
            !oldViewCache.serverCache.isFullyInitialized(), 'Once a server snap is complete, it should never go back');
        view.viewCache_ = result.viewCache;
        return viewGenerateEventsForChanges_(view, result.changes, result.viewCache.eventCache.getNode(), null);
    }
    function viewGenerateEventsForChanges_(view, changes, eventCache, eventRegistration) {
        const registrations = eventRegistration
            ? [eventRegistration]
            : view.eventRegistrations_;
        return eventGeneratorGenerateEventsForChanges(view.eventGenerator_, changes, eventCache, registrations);
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let referenceConstructor$1;
    function syncPointSetReferenceConstructor(val) {
        assert(!referenceConstructor$1, '__referenceConstructor has already been defined');
        referenceConstructor$1 = val;
    }
    function syncPointApplyOperation(syncPoint, operation, writesCache, optCompleteServerCache) {
        const queryId = operation.source.queryId;
        if (queryId !== null) {
            const view = syncPoint.views.get(queryId);
            assert(view != null, 'SyncTree gave us an op for an invalid query.');
            return viewApplyOperation(view, operation, writesCache, optCompleteServerCache);
        }
        else {
            let events = [];
            for (const view of syncPoint.views.values()) {
                events = events.concat(viewApplyOperation(view, operation, writesCache, optCompleteServerCache));
            }
            return events;
        }
    }
    /**
     * @param path - The path to the desired complete snapshot
     * @returns A complete cache, if it exists
     */
    function syncPointGetCompleteServerCache(syncPoint, path) {
        let serverCache = null;
        for (const view of syncPoint.views.values()) {
            serverCache = serverCache || viewGetCompleteServerCache(view, path);
        }
        return serverCache;
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    let referenceConstructor;
    function syncTreeSetReferenceConstructor(val) {
        assert(!referenceConstructor, '__referenceConstructor has already been defined');
        referenceConstructor = val;
    }
    /**
     * SyncTree is the central class for managing event callback registration, data caching, views
     * (query processing), and event generation.  There are typically two SyncTree instances for
     * each Repo, one for the normal Firebase data, and one for the .info data.
     *
     * It has a number of responsibilities, including:
     *  - Tracking all user event callbacks (registered via addEventRegistration() and removeEventRegistration()).
     *  - Applying and caching data changes for user set(), transaction(), and update() calls
     *    (applyUserOverwrite(), applyUserMerge()).
     *  - Applying and caching data changes for server data changes (applyServerOverwrite(),
     *    applyServerMerge()).
     *  - Generating user-facing events for server and user changes (all of the apply* methods
     *    return the set of events that need to be raised as a result).
     *  - Maintaining the appropriate set of server listens to ensure we are always subscribed
     *    to the correct set of paths and queries to satisfy the current set of user event
     *    callbacks (listens are started/stopped using the provided listenProvider).
     *
     * NOTE: Although SyncTree tracks event callbacks and calculates events to raise, the actual
     * events are returned to the caller rather than raised synchronously.
     *
     */
    class SyncTree {
        /**
         * @param listenProvider_ - Used by SyncTree to start / stop listening
         *   to server data.
         */
        constructor(listenProvider_) {
            this.listenProvider_ = listenProvider_;
            /**
             * Tree of SyncPoints.  There's a SyncPoint at any location that has 1 or more views.
             */
            this.syncPointTree_ = new ImmutableTree(null);
            /**
             * A tree of all pending user writes (user-initiated set()'s, transaction()'s, update()'s, etc.).
             */
            this.pendingWriteTree_ = newWriteTree();
            this.tagToQueryMap = new Map();
            this.queryToTagMap = new Map();
        }
    }
    /**
     * Apply the data changes for a user-generated set() or transaction() call.
     *
     * @returns Events to raise.
     */
    function syncTreeApplyUserOverwrite(syncTree, path, newData, writeId, visible) {
        // Record pending write.
        writeTreeAddOverwrite(syncTree.pendingWriteTree_, path, newData, writeId, visible);
        if (!visible) {
            return [];
        }
        else {
            return syncTreeApplyOperationToSyncPoints_(syncTree, new Overwrite(newOperationSourceUser(), path, newData));
        }
    }
    /**
     * Acknowledge a pending user write that was previously registered with applyUserOverwrite() or applyUserMerge().
     *
     * @param revert - True if the given write failed and needs to be reverted
     * @returns Events to raise.
     */
    function syncTreeAckUserWrite(syncTree, writeId, revert = false) {
        const write = writeTreeGetWrite(syncTree.pendingWriteTree_, writeId);
        const needToReevaluate = writeTreeRemoveWrite(syncTree.pendingWriteTree_, writeId);
        if (!needToReevaluate) {
            return [];
        }
        else {
            let affectedTree = new ImmutableTree(null);
            if (write.snap != null) {
                // overwrite
                affectedTree = affectedTree.set(newEmptyPath(), true);
            }
            else {
                each(write.children, (pathString) => {
                    affectedTree = affectedTree.set(new Path(pathString), true);
                });
            }
            return syncTreeApplyOperationToSyncPoints_(syncTree, new AckUserWrite(write.path, affectedTree, revert));
        }
    }
    /**
     * Apply new server data for the specified path..
     *
     * @returns Events to raise.
     */
    function syncTreeApplyServerOverwrite(syncTree, path, newData) {
        return syncTreeApplyOperationToSyncPoints_(syncTree, new Overwrite(newOperationSourceServer(), path, newData));
    }
    /**
     * Apply new server data to be merged in at the specified path.
     *
     * @returns Events to raise.
     */
    function syncTreeApplyServerMerge(syncTree, path, changedChildren) {
        const changeTree = ImmutableTree.fromObject(changedChildren);
        return syncTreeApplyOperationToSyncPoints_(syncTree, new Merge(newOperationSourceServer(), path, changeTree));
    }
    /**
     * Apply new server data for the specified tagged query.
     *
     * @returns Events to raise.
     */
    function syncTreeApplyTaggedQueryOverwrite(syncTree, path, snap, tag) {
        const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
        if (queryKey != null) {
            const r = syncTreeParseQueryKey_(queryKey);
            const queryPath = r.path, queryId = r.queryId;
            const relativePath = newRelativePath(queryPath, path);
            const op = new Overwrite(newOperationSourceServerTaggedQuery(queryId), relativePath, snap);
            return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
        }
        else {
            // Query must have been removed already
            return [];
        }
    }
    /**
     * Apply server data to be merged in for the specified tagged query.
     *
     * @returns Events to raise.
     */
    function syncTreeApplyTaggedQueryMerge(syncTree, path, changedChildren, tag) {
        const queryKey = syncTreeQueryKeyForTag_(syncTree, tag);
        if (queryKey) {
            const r = syncTreeParseQueryKey_(queryKey);
            const queryPath = r.path, queryId = r.queryId;
            const relativePath = newRelativePath(queryPath, path);
            const changeTree = ImmutableTree.fromObject(changedChildren);
            const op = new Merge(newOperationSourceServerTaggedQuery(queryId), relativePath, changeTree);
            return syncTreeApplyTaggedOperation_(syncTree, queryPath, op);
        }
        else {
            // We've already removed the query. No big deal, ignore the update
            return [];
        }
    }
    /**
     * Returns a complete cache, if we have one, of the data at a particular path. If the location does not have a
     * listener above it, we will get a false "null". This shouldn't be a problem because transactions will always
     * have a listener above, and atomic operations would correctly show a jitter of <increment value> ->
     *     <incremented total> as the write is applied locally and then acknowledged at the server.
     *
     * Note: this method will *include* hidden writes from transaction with applyLocally set to false.
     *
     * @param path - The path to the data we want
     * @param writeIdsToExclude - A specific set to be excluded
     */
    function syncTreeCalcCompleteEventCache(syncTree, path, writeIdsToExclude) {
        const includeHiddenSets = true;
        const writeTree = syncTree.pendingWriteTree_;
        const serverCache = syncTree.syncPointTree_.findOnPath(path, (pathSoFar, syncPoint) => {
            const relativePath = newRelativePath(pathSoFar, path);
            const serverCache = syncPointGetCompleteServerCache(syncPoint, relativePath);
            if (serverCache) {
                return serverCache;
            }
        });
        return writeTreeCalcCompleteEventCache(writeTree, path, serverCache, writeIdsToExclude, includeHiddenSets);
    }
    /**
     * A helper method that visits all descendant and ancestor SyncPoints, applying the operation.
     *
     * NOTES:
     * - Descendant SyncPoints will be visited first (since we raise events depth-first).
     *
     * - We call applyOperation() on each SyncPoint passing three things:
     *   1. A version of the Operation that has been made relative to the SyncPoint location.
     *   2. A WriteTreeRef of any writes we have cached at the SyncPoint location.
     *   3. A snapshot Node with cached server data, if we have it.
     *
     * - We concatenate all of the events returned by each SyncPoint and return the result.
     */
    function syncTreeApplyOperationToSyncPoints_(syncTree, operation) {
        return syncTreeApplyOperationHelper_(operation, syncTree.syncPointTree_, 
        /*serverCache=*/ null, writeTreeChildWrites(syncTree.pendingWriteTree_, newEmptyPath()));
    }
    /**
     * Recursive helper for applyOperationToSyncPoints_
     */
    function syncTreeApplyOperationHelper_(operation, syncPointTree, serverCache, writesCache) {
        if (pathIsEmpty(operation.path)) {
            return syncTreeApplyOperationDescendantsHelper_(operation, syncPointTree, serverCache, writesCache);
        }
        else {
            const syncPoint = syncPointTree.get(newEmptyPath());
            // If we don't have cached server data, see if we can get it from this SyncPoint.
            if (serverCache == null && syncPoint != null) {
                serverCache = syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
            }
            let events = [];
            const childName = pathGetFront(operation.path);
            const childOperation = operation.operationForChild(childName);
            const childTree = syncPointTree.children.get(childName);
            if (childTree && childOperation) {
                const childServerCache = serverCache
                    ? serverCache.getImmediateChild(childName)
                    : null;
                const childWritesCache = writeTreeRefChild(writesCache, childName);
                events = events.concat(syncTreeApplyOperationHelper_(childOperation, childTree, childServerCache, childWritesCache));
            }
            if (syncPoint) {
                events = events.concat(syncPointApplyOperation(syncPoint, operation, writesCache, serverCache));
            }
            return events;
        }
    }
    /**
     * Recursive helper for applyOperationToSyncPoints_
     */
    function syncTreeApplyOperationDescendantsHelper_(operation, syncPointTree, serverCache, writesCache) {
        const syncPoint = syncPointTree.get(newEmptyPath());
        // If we don't have cached server data, see if we can get it from this SyncPoint.
        if (serverCache == null && syncPoint != null) {
            serverCache = syncPointGetCompleteServerCache(syncPoint, newEmptyPath());
        }
        let events = [];
        syncPointTree.children.inorderTraversal((childName, childTree) => {
            const childServerCache = serverCache
                ? serverCache.getImmediateChild(childName)
                : null;
            const childWritesCache = writeTreeRefChild(writesCache, childName);
            const childOperation = operation.operationForChild(childName);
            if (childOperation) {
                events = events.concat(syncTreeApplyOperationDescendantsHelper_(childOperation, childTree, childServerCache, childWritesCache));
            }
        });
        if (syncPoint) {
            events = events.concat(syncPointApplyOperation(syncPoint, operation, writesCache, serverCache));
        }
        return events;
    }
    /**
     * Return the query associated with the given tag, if we have one
     */
    function syncTreeQueryKeyForTag_(syncTree, tag) {
        return syncTree.tagToQueryMap.get(tag);
    }
    /**
     * Given a queryKey (created by makeQueryKey), parse it back into a path and queryId.
     */
    function syncTreeParseQueryKey_(queryKey) {
        const splitIndex = queryKey.indexOf('$');
        assert(splitIndex !== -1 && splitIndex < queryKey.length - 1, 'Bad queryKey.');
        return {
            queryId: queryKey.substr(splitIndex + 1),
            path: new Path(queryKey.substr(0, splitIndex))
        };
    }
    /**
     * A helper method to apply tagged operations
     */
    function syncTreeApplyTaggedOperation_(syncTree, queryPath, operation) {
        const syncPoint = syncTree.syncPointTree_.get(queryPath);
        assert(syncPoint, "Missing sync point for query tag that we're tracking");
        const writesCache = writeTreeChildWrites(syncTree.pendingWriteTree_, queryPath);
        return syncPointApplyOperation(syncPoint, operation, writesCache, null);
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    class ExistingValueProvider {
        constructor(node_) {
            this.node_ = node_;
        }
        getImmediateChild(childName) {
            const child = this.node_.getImmediateChild(childName);
            return new ExistingValueProvider(child);
        }
        node() {
            return this.node_;
        }
    }
    class DeferredValueProvider {
        constructor(syncTree, path) {
            this.syncTree_ = syncTree;
            this.path_ = path;
        }
        getImmediateChild(childName) {
            const childPath = pathChild(this.path_, childName);
            return new DeferredValueProvider(this.syncTree_, childPath);
        }
        node() {
            return syncTreeCalcCompleteEventCache(this.syncTree_, this.path_);
        }
    }
    /**
     * Generate placeholders for deferred values.
     */
    const generateWithValues = function (values) {
        values = values || {};
        values['timestamp'] = values['timestamp'] || new Date().getTime();
        return values;
    };
    /**
     * Value to use when firing local events. When writing server values, fire
     * local events with an approximate value, otherwise return value as-is.
     */
    const resolveDeferredLeafValue = function (value, existingVal, serverValues) {
        if (!value || typeof value !== 'object') {
            return value;
        }
        assert('.sv' in value, 'Unexpected leaf node or priority contents');
        if (typeof value['.sv'] === 'string') {
            return resolveScalarDeferredValue(value['.sv'], existingVal, serverValues);
        }
        else if (typeof value['.sv'] === 'object') {
            return resolveComplexDeferredValue(value['.sv'], existingVal);
        }
        else {
            assert(false, 'Unexpected server value: ' + JSON.stringify(value, null, 2));
        }
    };
    const resolveScalarDeferredValue = function (op, existing, serverValues) {
        switch (op) {
            case 'timestamp':
                return serverValues['timestamp'];
            default:
                assert(false, 'Unexpected server value: ' + op);
        }
    };
    const resolveComplexDeferredValue = function (op, existing, unused) {
        if (!op.hasOwnProperty('increment')) {
            assert(false, 'Unexpected server value: ' + JSON.stringify(op, null, 2));
        }
        const delta = op['increment'];
        if (typeof delta !== 'number') {
            assert(false, 'Unexpected increment value: ' + delta);
        }
        const existingNode = existing.node();
        assert(existingNode !== null && typeof existingNode !== 'undefined', 'Expected ChildrenNode.EMPTY_NODE for nulls');
        // Incrementing a non-number sets the value to the incremented amount
        if (!existingNode.isLeafNode()) {
            return delta;
        }
        const leaf = existingNode;
        const existingVal = leaf.getValue();
        if (typeof existingVal !== 'number') {
            return delta;
        }
        // No need to do over/underflow arithmetic here because JS only handles floats under the covers
        return existingVal + delta;
    };
    /**
     * Recursively replace all deferred values and priorities in the tree with the
     * specified generated replacement values.
     * @param path - path to which write is relative
     * @param node - new data written at path
     * @param syncTree - current data
     */
    const resolveDeferredValueTree = function (path, node, syncTree, serverValues) {
        return resolveDeferredValue(node, new DeferredValueProvider(syncTree, path), serverValues);
    };
    /**
     * Recursively replace all deferred values and priorities in the node with the
     * specified generated replacement values.  If there are no server values in the node,
     * it'll be returned as-is.
     */
    const resolveDeferredValueSnapshot = function (node, existing, serverValues) {
        return resolveDeferredValue(node, new ExistingValueProvider(existing), serverValues);
    };
    function resolveDeferredValue(node, existingVal, serverValues) {
        const rawPri = node.getPriority().val();
        const priority = resolveDeferredLeafValue(rawPri, existingVal.getImmediateChild('.priority'), serverValues);
        let newNode;
        if (node.isLeafNode()) {
            const leafNode = node;
            const value = resolveDeferredLeafValue(leafNode.getValue(), existingVal, serverValues);
            if (value !== leafNode.getValue() ||
                priority !== leafNode.getPriority().val()) {
                return new LeafNode(value, nodeFromJSON(priority));
            }
            else {
                return node;
            }
        }
        else {
            const childrenNode = node;
            newNode = childrenNode;
            if (priority !== childrenNode.getPriority().val()) {
                newNode = newNode.updatePriority(new LeafNode(priority));
            }
            childrenNode.forEachChild(PRIORITY_INDEX, (childName, childNode) => {
                const newChildNode = resolveDeferredValue(childNode, existingVal.getImmediateChild(childName), serverValues);
                if (newChildNode !== childNode) {
                    newNode = newNode.updateImmediateChild(childName, newChildNode);
                }
            });
            return newNode;
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * A light-weight tree, traversable by path.  Nodes can have both values and children.
     * Nodes are not enumerated (by forEachChild) unless they have a value or non-empty
     * children.
     */
    class Tree {
        /**
         * @param name - Optional name of the node.
         * @param parent - Optional parent node.
         * @param node - Optional node to wrap.
         */
        constructor(name = '', parent = null, node = { children: {}, childCount: 0 }) {
            this.name = name;
            this.parent = parent;
            this.node = node;
        }
    }
    /**
     * Returns a sub-Tree for the given path.
     *
     * @param pathObj - Path to look up.
     * @returns Tree for path.
     */
    function treeSubTree(tree, pathObj) {
        // TODO: Require pathObj to be Path?
        let path = pathObj instanceof Path ? pathObj : new Path(pathObj);
        let child = tree, next = pathGetFront(path);
        while (next !== null) {
            const childNode = safeGet(child.node.children, next) || {
                children: {},
                childCount: 0
            };
            child = new Tree(next, child, childNode);
            path = pathPopFront(path);
            next = pathGetFront(path);
        }
        return child;
    }
    /**
     * Returns the data associated with this tree node.
     *
     * @returns The data or null if no data exists.
     */
    function treeGetValue(tree) {
        return tree.node.value;
    }
    /**
     * Sets data to this tree node.
     *
     * @param value - Value to set.
     */
    function treeSetValue(tree, value) {
        tree.node.value = value;
        treeUpdateParents(tree);
    }
    /**
     * @returns Whether the tree has any children.
     */
    function treeHasChildren(tree) {
        return tree.node.childCount > 0;
    }
    /**
     * @returns Whethe rthe tree is empty (no value or children).
     */
    function treeIsEmpty(tree) {
        return treeGetValue(tree) === undefined && !treeHasChildren(tree);
    }
    /**
     * Calls action for each child of this tree node.
     *
     * @param action - Action to be called for each child.
     */
    function treeForEachChild(tree, action) {
        each(tree.node.children, (child, childTree) => {
            action(new Tree(child, tree, childTree));
        });
    }
    /**
     * Does a depth-first traversal of this node's descendants, calling action for each one.
     *
     * @param action - Action to be called for each child.
     * @param includeSelf - Whether to call action on this node as well. Defaults to
     *   false.
     * @param childrenFirst - Whether to call action on children before calling it on
     *   parent.
     */
    function treeForEachDescendant(tree, action, includeSelf, childrenFirst) {
        if (includeSelf && !childrenFirst) {
            action(tree);
        }
        treeForEachChild(tree, child => {
            treeForEachDescendant(child, action, true, childrenFirst);
        });
        if (includeSelf && childrenFirst) {
            action(tree);
        }
    }
    /**
     * Calls action on each ancestor node.
     *
     * @param action - Action to be called on each parent; return
     *   true to abort.
     * @param includeSelf - Whether to call action on this node as well.
     * @returns true if the action callback returned true.
     */
    function treeForEachAncestor(tree, action, includeSelf) {
        let node = includeSelf ? tree : tree.parent;
        while (node !== null) {
            if (action(node)) {
                return true;
            }
            node = node.parent;
        }
        return false;
    }
    /**
     * @returns The path of this tree node, as a Path.
     */
    function treeGetPath(tree) {
        return new Path(tree.parent === null
            ? tree.name
            : treeGetPath(tree.parent) + '/' + tree.name);
    }
    /**
     * Adds or removes this child from its parent based on whether it's empty or not.
     */
    function treeUpdateParents(tree) {
        if (tree.parent !== null) {
            treeUpdateChild(tree.parent, tree.name, tree);
        }
    }
    /**
     * Adds or removes the passed child to this tree node, depending on whether it's empty.
     *
     * @param childName - The name of the child to update.
     * @param child - The child to update.
     */
    function treeUpdateChild(tree, childName, child) {
        const childEmpty = treeIsEmpty(child);
        const childExists = contains(tree.node.children, childName);
        if (childEmpty && childExists) {
            delete tree.node.children[childName];
            tree.node.childCount--;
            treeUpdateParents(tree);
        }
        else if (!childEmpty && !childExists) {
            tree.node.children[childName] = child.node;
            tree.node.childCount++;
            treeUpdateParents(tree);
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * True for invalid Firebase keys
     */
    const INVALID_KEY_REGEX_ = /[\[\].#$\/\u0000-\u001F\u007F]/;
    /**
     * True for invalid Firebase paths.
     * Allows '/' in paths.
     */
    const INVALID_PATH_REGEX_ = /[\[\].#$\u0000-\u001F\u007F]/;
    /**
     * Maximum number of characters to allow in leaf value
     */
    const MAX_LEAF_SIZE_ = 10 * 1024 * 1024;
    const isValidKey = function (key) {
        return (typeof key === 'string' && key.length !== 0 && !INVALID_KEY_REGEX_.test(key));
    };
    const isValidPathString = function (pathString) {
        return (typeof pathString === 'string' &&
            pathString.length !== 0 &&
            !INVALID_PATH_REGEX_.test(pathString));
    };
    const isValidRootPathString = function (pathString) {
        if (pathString) {
            // Allow '/.info/' at the beginning.
            pathString = pathString.replace(/^\/*\.info(\/|$)/, '/');
        }
        return isValidPathString(pathString);
    };
    /**
     * Pre-validate a datum passed as an argument to Firebase function.
     */
    const validateFirebaseDataArg = function (fnName, value, path, optional) {
        if (optional && value === undefined) {
            return;
        }
        validateFirebaseData(errorPrefix(fnName, 'value'), value, path);
    };
    /**
     * Validate a data object client-side before sending to server.
     */
    const validateFirebaseData = function (errorPrefix, data, path_) {
        const path = path_ instanceof Path ? new ValidationPath(path_, errorPrefix) : path_;
        if (data === undefined) {
            throw new Error(errorPrefix + 'contains undefined ' + validationPathToErrorString(path));
        }
        if (typeof data === 'function') {
            throw new Error(errorPrefix +
                'contains a function ' +
                validationPathToErrorString(path) +
                ' with contents = ' +
                data.toString());
        }
        if (isInvalidJSONNumber(data)) {
            throw new Error(errorPrefix +
                'contains ' +
                data.toString() +
                ' ' +
                validationPathToErrorString(path));
        }
        // Check max leaf size, but try to avoid the utf8 conversion if we can.
        if (typeof data === 'string' &&
            data.length > MAX_LEAF_SIZE_ / 3 &&
            stringLength(data) > MAX_LEAF_SIZE_) {
            throw new Error(errorPrefix +
                'contains a string greater than ' +
                MAX_LEAF_SIZE_ +
                ' utf8 bytes ' +
                validationPathToErrorString(path) +
                " ('" +
                data.substring(0, 50) +
                "...')");
        }
        // TODO = Perf = Consider combining the recursive validation of keys into NodeFromJSON
        // to save extra walking of large objects.
        if (data && typeof data === 'object') {
            let hasDotValue = false;
            let hasActualChild = false;
            each(data, (key, value) => {
                if (key === '.value') {
                    hasDotValue = true;
                }
                else if (key !== '.priority' && key !== '.sv') {
                    hasActualChild = true;
                    if (!isValidKey(key)) {
                        throw new Error(errorPrefix +
                            ' contains an invalid key (' +
                            key +
                            ') ' +
                            validationPathToErrorString(path) +
                            '.  Keys must be non-empty strings ' +
                            'and can\'t contain ".", "#", "$", "/", "[", or "]"');
                    }
                }
                validationPathPush(path, key);
                validateFirebaseData(errorPrefix, value, path);
                validationPathPop(path);
            });
            if (hasDotValue && hasActualChild) {
                throw new Error(errorPrefix +
                    ' contains ".value" child ' +
                    validationPathToErrorString(path) +
                    ' in addition to actual children.');
            }
        }
    };
    /**
     * @internal
     */
    const validatePathString = function (fnName, argumentName, pathString, optional) {
        if (optional && pathString === undefined) {
            return;
        }
        if (!isValidPathString(pathString)) {
            throw new Error(errorPrefix(fnName, argumentName) +
                'was an invalid path = "' +
                pathString +
                '". Paths must be non-empty strings and ' +
                'can\'t contain ".", "#", "$", "[", or "]"');
        }
    };
    const validateRootPathString = function (fnName, argumentName, pathString, optional) {
        if (pathString) {
            // Allow '/.info/' at the beginning.
            pathString = pathString.replace(/^\/*\.info(\/|$)/, '/');
        }
        validatePathString(fnName, argumentName, pathString, optional);
    };
    /**
     * @internal
     */
    const validateWritablePath = function (fnName, path) {
        if (pathGetFront(path) === '.info') {
            throw new Error(fnName + " failed = Can't modify data under /.info/");
        }
    };
    const validateUrl = function (fnName, parsedUrl) {
        // TODO = Validate server better.
        const pathString = parsedUrl.path.toString();
        if (!(typeof parsedUrl.repoInfo.host === 'string') ||
            parsedUrl.repoInfo.host.length === 0 ||
            (!isValidKey(parsedUrl.repoInfo.namespace) &&
                parsedUrl.repoInfo.host.split(':')[0] !== 'localhost') ||
            (pathString.length !== 0 && !isValidRootPathString(pathString))) {
            throw new Error(errorPrefix(fnName, 'url') +
                'must be a valid firebase URL and ' +
                'the path can\'t contain ".", "#", "$", "[", or "]".');
        }
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * The event queue serves a few purposes:
     * 1. It ensures we maintain event order in the face of event callbacks doing operations that result in more
     *    events being queued.
     * 2. raiseQueuedEvents() handles being called reentrantly nicely.  That is, if in the course of raising events,
     *    raiseQueuedEvents() is called again, the "inner" call will pick up raising events where the "outer" call
     *    left off, ensuring that the events are still raised synchronously and in order.
     * 3. You can use raiseEventsAtPath and raiseEventsForChangedPath to ensure only relevant previously-queued
     *    events are raised synchronously.
     *
     * NOTE: This can all go away if/when we move to async events.
     *
     */
    class EventQueue {
        constructor() {
            this.eventLists_ = [];
            /**
             * Tracks recursion depth of raiseQueuedEvents_, for debugging purposes.
             */
            this.recursionDepth_ = 0;
        }
    }
    /**
     * @param eventDataList - The new events to queue.
     */
    function eventQueueQueueEvents(eventQueue, eventDataList) {
        // We group events by path, storing them in a single EventList, to make it easier to skip over them quickly.
        let currList = null;
        for (let i = 0; i < eventDataList.length; i++) {
            const data = eventDataList[i];
            const path = data.getPath();
            if (currList !== null && !pathEquals(path, currList.path)) {
                eventQueue.eventLists_.push(currList);
                currList = null;
            }
            if (currList === null) {
                currList = { events: [], path };
            }
            currList.events.push(data);
        }
        if (currList) {
            eventQueue.eventLists_.push(currList);
        }
    }
    /**
     * Queues the specified events and synchronously raises all events (including previously queued ones) for
     * locations related to the specified change path (i.e. all ancestors and descendants).
     *
     * It is assumed that the new events are all related (ancestor or descendant) to the specified path.
     *
     * @param changedPath - The path to raise events for.
     * @param eventDataList - The events to raise
     */
    function eventQueueRaiseEventsForChangedPath(eventQueue, changedPath, eventDataList) {
        eventQueueQueueEvents(eventQueue, eventDataList);
        eventQueueRaiseQueuedEventsMatchingPredicate(eventQueue, eventPath => pathContains(eventPath, changedPath) ||
            pathContains(changedPath, eventPath));
    }
    function eventQueueRaiseQueuedEventsMatchingPredicate(eventQueue, predicate) {
        eventQueue.recursionDepth_++;
        let sentAll = true;
        for (let i = 0; i < eventQueue.eventLists_.length; i++) {
            const eventList = eventQueue.eventLists_[i];
            if (eventList) {
                const eventPath = eventList.path;
                if (predicate(eventPath)) {
                    eventListRaise(eventQueue.eventLists_[i]);
                    eventQueue.eventLists_[i] = null;
                }
                else {
                    sentAll = false;
                }
            }
        }
        if (sentAll) {
            eventQueue.eventLists_ = [];
        }
        eventQueue.recursionDepth_--;
    }
    /**
     * Iterates through the list and raises each event
     */
    function eventListRaise(eventList) {
        for (let i = 0; i < eventList.events.length; i++) {
            const eventData = eventList.events[i];
            if (eventData !== null) {
                eventList.events[i] = null;
                const eventFn = eventData.getEventRunner();
                if (logger) {
                    log('event: ' + eventData.toString());
                }
                exceptionGuard(eventFn);
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    const INTERRUPT_REASON = 'repo_interrupt';
    /**
     * If a transaction does not succeed after 25 retries, we abort it. Among other
     * things this ensure that if there's ever a bug causing a mismatch between
     * client / server hashes for some data, we won't retry indefinitely.
     */
    const MAX_TRANSACTION_RETRIES = 25;
    /**
     * A connection to a single data repository.
     */
    class Repo {
        constructor(repoInfo_, forceRestClient_, authTokenProvider_, appCheckProvider_) {
            this.repoInfo_ = repoInfo_;
            this.forceRestClient_ = forceRestClient_;
            this.authTokenProvider_ = authTokenProvider_;
            this.appCheckProvider_ = appCheckProvider_;
            this.dataUpdateCount = 0;
            this.statsListener_ = null;
            this.eventQueue_ = new EventQueue();
            this.nextWriteId_ = 1;
            this.interceptServerDataCallback_ = null;
            /** A list of data pieces and paths to be set when this client disconnects. */
            this.onDisconnect_ = newSparseSnapshotTree();
            /** Stores queues of outstanding transactions for Firebase locations. */
            this.transactionQueueTree_ = new Tree();
            // TODO: This should be @private but it's used by test_access.js and internal.js
            this.persistentConnection_ = null;
            // This key is intentionally not updated if RepoInfo is later changed or replaced
            this.key = this.repoInfo_.toURLString();
        }
        /**
         * @returns The URL corresponding to the root of this Firebase.
         */
        toString() {
            return ((this.repoInfo_.secure ? 'https://' : 'http://') + this.repoInfo_.host);
        }
    }
    function repoStart(repo, appId, authOverride) {
        repo.stats_ = statsManagerGetCollection(repo.repoInfo_);
        if (repo.forceRestClient_ || beingCrawled()) {
            repo.server_ = new ReadonlyRestClient(repo.repoInfo_, (pathString, data, isMerge, tag) => {
                repoOnDataUpdate(repo, pathString, data, isMerge, tag);
            }, repo.authTokenProvider_, repo.appCheckProvider_);
            // Minor hack: Fire onConnect immediately, since there's no actual connection.
            setTimeout(() => repoOnConnectStatus(repo, /* connectStatus= */ true), 0);
        }
        else {
            // Validate authOverride
            if (typeof authOverride !== 'undefined' && authOverride !== null) {
                if (typeof authOverride !== 'object') {
                    throw new Error('Only objects are supported for option databaseAuthVariableOverride');
                }
                try {
                    stringify(authOverride);
                }
                catch (e) {
                    throw new Error('Invalid authOverride provided: ' + e);
                }
            }
            repo.persistentConnection_ = new PersistentConnection(repo.repoInfo_, appId, (pathString, data, isMerge, tag) => {
                repoOnDataUpdate(repo, pathString, data, isMerge, tag);
            }, (connectStatus) => {
                repoOnConnectStatus(repo, connectStatus);
            }, (updates) => {
                repoOnServerInfoUpdate(repo, updates);
            }, repo.authTokenProvider_, repo.appCheckProvider_, authOverride);
            repo.server_ = repo.persistentConnection_;
        }
        repo.authTokenProvider_.addTokenChangeListener(token => {
            repo.server_.refreshAuthToken(token);
        });
        repo.appCheckProvider_.addTokenChangeListener(result => {
            repo.server_.refreshAppCheckToken(result.token);
        });
        // In the case of multiple Repos for the same repoInfo (i.e. there are multiple Firebase.Contexts being used),
        // we only want to create one StatsReporter.  As such, we'll report stats over the first Repo created.
        repo.statsReporter_ = statsManagerGetOrCreateReporter(repo.repoInfo_, () => new StatsReporter(repo.stats_, repo.server_));
        // Used for .info.
        repo.infoData_ = new SnapshotHolder();
        repo.infoSyncTree_ = new SyncTree({
            startListening: (query, tag, currentHashFn, onComplete) => {
                let infoEvents = [];
                const node = repo.infoData_.getNode(query._path);
                // This is possibly a hack, but we have different semantics for .info endpoints. We don't raise null events
                // on initial data...
                if (!node.isEmpty()) {
                    infoEvents = syncTreeApplyServerOverwrite(repo.infoSyncTree_, query._path, node);
                    setTimeout(() => {
                        onComplete('ok');
                    }, 0);
                }
                return infoEvents;
            },
            stopListening: () => { }
        });
        repoUpdateInfo(repo, 'connected', false);
        repo.serverSyncTree_ = new SyncTree({
            startListening: (query, tag, currentHashFn, onComplete) => {
                repo.server_.listen(query, currentHashFn, tag, (status, data) => {
                    const events = onComplete(status, data);
                    eventQueueRaiseEventsForChangedPath(repo.eventQueue_, query._path, events);
                });
                // No synchronous events for network-backed sync trees
                return [];
            },
            stopListening: (query, tag) => {
                repo.server_.unlisten(query, tag);
            }
        });
    }
    /**
     * @returns The time in milliseconds, taking the server offset into account if we have one.
     */
    function repoServerTime(repo) {
        const offsetNode = repo.infoData_.getNode(new Path('.info/serverTimeOffset'));
        const offset = offsetNode.val() || 0;
        return new Date().getTime() + offset;
    }
    /**
     * Generate ServerValues using some variables from the repo object.
     */
    function repoGenerateServerValues(repo) {
        return generateWithValues({
            timestamp: repoServerTime(repo)
        });
    }
    /**
     * Called by realtime when we get new messages from the server.
     */
    function repoOnDataUpdate(repo, pathString, data, isMerge, tag) {
        // For testing.
        repo.dataUpdateCount++;
        const path = new Path(pathString);
        data = repo.interceptServerDataCallback_
            ? repo.interceptServerDataCallback_(pathString, data)
            : data;
        let events = [];
        if (tag) {
            if (isMerge) {
                const taggedChildren = map(data, (raw) => nodeFromJSON(raw));
                events = syncTreeApplyTaggedQueryMerge(repo.serverSyncTree_, path, taggedChildren, tag);
            }
            else {
                const taggedSnap = nodeFromJSON(data);
                events = syncTreeApplyTaggedQueryOverwrite(repo.serverSyncTree_, path, taggedSnap, tag);
            }
        }
        else if (isMerge) {
            const changedChildren = map(data, (raw) => nodeFromJSON(raw));
            events = syncTreeApplyServerMerge(repo.serverSyncTree_, path, changedChildren);
        }
        else {
            const snap = nodeFromJSON(data);
            events = syncTreeApplyServerOverwrite(repo.serverSyncTree_, path, snap);
        }
        let affectedPath = path;
        if (events.length > 0) {
            // Since we have a listener outstanding for each transaction, receiving any events
            // is a proxy for some change having occurred.
            affectedPath = repoRerunTransactions(repo, path);
        }
        eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, events);
    }
    function repoOnConnectStatus(repo, connectStatus) {
        repoUpdateInfo(repo, 'connected', connectStatus);
        if (connectStatus === false) {
            repoRunOnDisconnectEvents(repo);
        }
    }
    function repoOnServerInfoUpdate(repo, updates) {
        each(updates, (key, value) => {
            repoUpdateInfo(repo, key, value);
        });
    }
    function repoUpdateInfo(repo, pathString, value) {
        const path = new Path('/.info/' + pathString);
        const newNode = nodeFromJSON(value);
        repo.infoData_.updateSnapshot(path, newNode);
        const events = syncTreeApplyServerOverwrite(repo.infoSyncTree_, path, newNode);
        eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
    }
    function repoGetNextWriteId(repo) {
        return repo.nextWriteId_++;
    }
    function repoSetWithPriority(repo, path, newVal, newPriority, onComplete) {
        repoLog(repo, 'set', {
            path: path.toString(),
            value: newVal,
            priority: newPriority
        });
        // TODO: Optimize this behavior to either (a) store flag to skip resolving where possible and / or
        // (b) store unresolved paths on JSON parse
        const serverValues = repoGenerateServerValues(repo);
        const newNodeUnresolved = nodeFromJSON(newVal, newPriority);
        const existing = syncTreeCalcCompleteEventCache(repo.serverSyncTree_, path);
        const newNode = resolveDeferredValueSnapshot(newNodeUnresolved, existing, serverValues);
        const writeId = repoGetNextWriteId(repo);
        const events = syncTreeApplyUserOverwrite(repo.serverSyncTree_, path, newNode, writeId, true);
        eventQueueQueueEvents(repo.eventQueue_, events);
        repo.server_.put(path.toString(), newNodeUnresolved.val(/*export=*/ true), (status, errorReason) => {
            const success = status === 'ok';
            if (!success) {
                warn('set at ' + path + ' failed: ' + status);
            }
            const clearEvents = syncTreeAckUserWrite(repo.serverSyncTree_, writeId, !success);
            eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, clearEvents);
            repoCallOnCompleteCallback(repo, onComplete, status, errorReason);
        });
        const affectedPath = repoAbortTransactions(repo, path);
        repoRerunTransactions(repo, affectedPath);
        // We queued the events above, so just flush the queue here
        eventQueueRaiseEventsForChangedPath(repo.eventQueue_, affectedPath, []);
    }
    /**
     * Applies all of the changes stored up in the onDisconnect_ tree.
     */
    function repoRunOnDisconnectEvents(repo) {
        repoLog(repo, 'onDisconnectEvents');
        const serverValues = repoGenerateServerValues(repo);
        const resolvedOnDisconnectTree = newSparseSnapshotTree();
        sparseSnapshotTreeForEachTree(repo.onDisconnect_, newEmptyPath(), (path, node) => {
            const resolved = resolveDeferredValueTree(path, node, repo.serverSyncTree_, serverValues);
            sparseSnapshotTreeRemember(resolvedOnDisconnectTree, path, resolved);
        });
        let events = [];
        sparseSnapshotTreeForEachTree(resolvedOnDisconnectTree, newEmptyPath(), (path, snap) => {
            events = events.concat(syncTreeApplyServerOverwrite(repo.serverSyncTree_, path, snap));
            const affectedPath = repoAbortTransactions(repo, path);
            repoRerunTransactions(repo, affectedPath);
        });
        repo.onDisconnect_ = newSparseSnapshotTree();
        eventQueueRaiseEventsForChangedPath(repo.eventQueue_, newEmptyPath(), events);
    }
    function repoInterrupt(repo) {
        if (repo.persistentConnection_) {
            repo.persistentConnection_.interrupt(INTERRUPT_REASON);
        }
    }
    function repoLog(repo, ...varArgs) {
        let prefix = '';
        if (repo.persistentConnection_) {
            prefix = repo.persistentConnection_.id + ':';
        }
        log(prefix, ...varArgs);
    }
    function repoCallOnCompleteCallback(repo, callback, status, errorReason) {
        if (callback) {
            exceptionGuard(() => {
                if (status === 'ok') {
                    callback(null);
                }
                else {
                    const code = (status || 'error').toUpperCase();
                    let message = code;
                    if (errorReason) {
                        message += ': ' + errorReason;
                    }
                    const error = new Error(message);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    error.code = code;
                    callback(error);
                }
            });
        }
    }
    /**
     * @param excludeSets - A specific set to exclude
     */
    function repoGetLatestState(repo, path, excludeSets) {
        return (syncTreeCalcCompleteEventCache(repo.serverSyncTree_, path, excludeSets) ||
            ChildrenNode.EMPTY_NODE);
    }
    /**
     * Sends any already-run transactions that aren't waiting for outstanding
     * transactions to complete.
     *
     * Externally it's called with no arguments, but it calls itself recursively
     * with a particular transactionQueueTree node to recurse through the tree.
     *
     * @param node - transactionQueueTree node to start at.
     */
    function repoSendReadyTransactions(repo, node = repo.transactionQueueTree_) {
        // Before recursing, make sure any completed transactions are removed.
        if (!node) {
            repoPruneCompletedTransactionsBelowNode(repo, node);
        }
        if (treeGetValue(node)) {
            const queue = repoBuildTransactionQueue(repo, node);
            assert(queue.length > 0, 'Sending zero length transaction queue');
            const allRun = queue.every((transaction) => transaction.status === 0 /* TransactionStatus.RUN */);
            // If they're all run (and not sent), we can send them.  Else, we must wait.
            if (allRun) {
                repoSendTransactionQueue(repo, treeGetPath(node), queue);
            }
        }
        else if (treeHasChildren(node)) {
            treeForEachChild(node, childNode => {
                repoSendReadyTransactions(repo, childNode);
            });
        }
    }
    /**
     * Given a list of run transactions, send them to the server and then handle
     * the result (success or failure).
     *
     * @param path - The location of the queue.
     * @param queue - Queue of transactions under the specified location.
     */
    function repoSendTransactionQueue(repo, path, queue) {
        // Mark transactions as sent and increment retry count!
        const setsToIgnore = queue.map(txn => {
            return txn.currentWriteId;
        });
        const latestState = repoGetLatestState(repo, path, setsToIgnore);
        let snapToSend = latestState;
        const latestHash = latestState.hash();
        for (let i = 0; i < queue.length; i++) {
            const txn = queue[i];
            assert(txn.status === 0 /* TransactionStatus.RUN */, 'tryToSendTransactionQueue_: items in queue should all be run.');
            txn.status = 1 /* TransactionStatus.SENT */;
            txn.retryCount++;
            const relativePath = newRelativePath(path, txn.path);
            // If we've gotten to this point, the output snapshot must be defined.
            snapToSend = snapToSend.updateChild(relativePath /** @type {!Node} */, txn.currentOutputSnapshotRaw);
        }
        const dataToSend = snapToSend.val(true);
        const pathToSend = path;
        // Send the put.
        repo.server_.put(pathToSend.toString(), dataToSend, (status) => {
            repoLog(repo, 'transaction put response', {
                path: pathToSend.toString(),
                status
            });
            let events = [];
            if (status === 'ok') {
                // Queue up the callbacks and fire them after cleaning up all of our
                // transaction state, since the callback could trigger more
                // transactions or sets.
                const callbacks = [];
                for (let i = 0; i < queue.length; i++) {
                    queue[i].status = 2 /* TransactionStatus.COMPLETED */;
                    events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, queue[i].currentWriteId));
                    if (queue[i].onComplete) {
                        // We never unset the output snapshot, and given that this
                        // transaction is complete, it should be set
                        callbacks.push(() => queue[i].onComplete(null, true, queue[i].currentOutputSnapshotResolved));
                    }
                    queue[i].unwatcher();
                }
                // Now remove the completed transactions.
                repoPruneCompletedTransactionsBelowNode(repo, treeSubTree(repo.transactionQueueTree_, path));
                // There may be pending transactions that we can now send.
                repoSendReadyTransactions(repo, repo.transactionQueueTree_);
                eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
                // Finally, trigger onComplete callbacks.
                for (let i = 0; i < callbacks.length; i++) {
                    exceptionGuard(callbacks[i]);
                }
            }
            else {
                // transactions are no longer sent.  Update their status appropriately.
                if (status === 'datastale') {
                    for (let i = 0; i < queue.length; i++) {
                        if (queue[i].status === 3 /* TransactionStatus.SENT_NEEDS_ABORT */) {
                            queue[i].status = 4 /* TransactionStatus.NEEDS_ABORT */;
                        }
                        else {
                            queue[i].status = 0 /* TransactionStatus.RUN */;
                        }
                    }
                }
                else {
                    warn('transaction at ' + pathToSend.toString() + ' failed: ' + status);
                    for (let i = 0; i < queue.length; i++) {
                        queue[i].status = 4 /* TransactionStatus.NEEDS_ABORT */;
                        queue[i].abortReason = status;
                    }
                }
                repoRerunTransactions(repo, path);
            }
        }, latestHash);
    }
    /**
     * Finds all transactions dependent on the data at changedPath and reruns them.
     *
     * Should be called any time cached data changes.
     *
     * Return the highest path that was affected by rerunning transactions. This
     * is the path at which events need to be raised for.
     *
     * @param changedPath - The path in mergedData that changed.
     * @returns The rootmost path that was affected by rerunning transactions.
     */
    function repoRerunTransactions(repo, changedPath) {
        const rootMostTransactionNode = repoGetAncestorTransactionNode(repo, changedPath);
        const path = treeGetPath(rootMostTransactionNode);
        const queue = repoBuildTransactionQueue(repo, rootMostTransactionNode);
        repoRerunTransactionQueue(repo, queue, path);
        return path;
    }
    /**
     * Does all the work of rerunning transactions (as well as cleans up aborted
     * transactions and whatnot).
     *
     * @param queue - The queue of transactions to run.
     * @param path - The path the queue is for.
     */
    function repoRerunTransactionQueue(repo, queue, path) {
        if (queue.length === 0) {
            return; // Nothing to do!
        }
        // Queue up the callbacks and fire them after cleaning up all of our
        // transaction state, since the callback could trigger more transactions or
        // sets.
        const callbacks = [];
        let events = [];
        // Ignore all of the sets we're going to re-run.
        const txnsToRerun = queue.filter(q => {
            return q.status === 0 /* TransactionStatus.RUN */;
        });
        const setsToIgnore = txnsToRerun.map(q => {
            return q.currentWriteId;
        });
        for (let i = 0; i < queue.length; i++) {
            const transaction = queue[i];
            const relativePath = newRelativePath(path, transaction.path);
            let abortTransaction = false, abortReason;
            assert(relativePath !== null, 'rerunTransactionsUnderNode_: relativePath should not be null.');
            if (transaction.status === 4 /* TransactionStatus.NEEDS_ABORT */) {
                abortTransaction = true;
                abortReason = transaction.abortReason;
                events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
            }
            else if (transaction.status === 0 /* TransactionStatus.RUN */) {
                if (transaction.retryCount >= MAX_TRANSACTION_RETRIES) {
                    abortTransaction = true;
                    abortReason = 'maxretry';
                    events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
                }
                else {
                    // This code reruns a transaction
                    const currentNode = repoGetLatestState(repo, transaction.path, setsToIgnore);
                    transaction.currentInputSnapshot = currentNode;
                    const newData = queue[i].update(currentNode.val());
                    if (newData !== undefined) {
                        validateFirebaseData('transaction failed: Data returned ', newData, transaction.path);
                        let newDataNode = nodeFromJSON(newData);
                        const hasExplicitPriority = typeof newData === 'object' &&
                            newData != null &&
                            contains(newData, '.priority');
                        if (!hasExplicitPriority) {
                            // Keep the old priority if there wasn't a priority explicitly specified.
                            newDataNode = newDataNode.updatePriority(currentNode.getPriority());
                        }
                        const oldWriteId = transaction.currentWriteId;
                        const serverValues = repoGenerateServerValues(repo);
                        const newNodeResolved = resolveDeferredValueSnapshot(newDataNode, currentNode, serverValues);
                        transaction.currentOutputSnapshotRaw = newDataNode;
                        transaction.currentOutputSnapshotResolved = newNodeResolved;
                        transaction.currentWriteId = repoGetNextWriteId(repo);
                        // Mutates setsToIgnore in place
                        setsToIgnore.splice(setsToIgnore.indexOf(oldWriteId), 1);
                        events = events.concat(syncTreeApplyUserOverwrite(repo.serverSyncTree_, transaction.path, newNodeResolved, transaction.currentWriteId, transaction.applyLocally));
                        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, oldWriteId, true));
                    }
                    else {
                        abortTransaction = true;
                        abortReason = 'nodata';
                        events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, transaction.currentWriteId, true));
                    }
                }
            }
            eventQueueRaiseEventsForChangedPath(repo.eventQueue_, path, events);
            events = [];
            if (abortTransaction) {
                // Abort.
                queue[i].status = 2 /* TransactionStatus.COMPLETED */;
                // Removing a listener can trigger pruning which can muck with
                // mergedData/visibleData (as it prunes data). So defer the unwatcher
                // until we're done.
                (function (unwatcher) {
                    setTimeout(unwatcher, Math.floor(0));
                })(queue[i].unwatcher);
                if (queue[i].onComplete) {
                    if (abortReason === 'nodata') {
                        callbacks.push(() => queue[i].onComplete(null, false, queue[i].currentInputSnapshot));
                    }
                    else {
                        callbacks.push(() => queue[i].onComplete(new Error(abortReason), false, null));
                    }
                }
            }
        }
        // Clean up completed transactions.
        repoPruneCompletedTransactionsBelowNode(repo, repo.transactionQueueTree_);
        // Now fire callbacks, now that we're in a good, known state.
        for (let i = 0; i < callbacks.length; i++) {
            exceptionGuard(callbacks[i]);
        }
        // Try to send the transaction result to the server.
        repoSendReadyTransactions(repo, repo.transactionQueueTree_);
    }
    /**
     * Returns the rootmost ancestor node of the specified path that has a pending
     * transaction on it, or just returns the node for the given path if there are
     * no pending transactions on any ancestor.
     *
     * @param path - The location to start at.
     * @returns The rootmost node with a transaction.
     */
    function repoGetAncestorTransactionNode(repo, path) {
        let front;
        // Start at the root and walk deeper into the tree towards path until we
        // find a node with pending transactions.
        let transactionNode = repo.transactionQueueTree_;
        front = pathGetFront(path);
        while (front !== null && treeGetValue(transactionNode) === undefined) {
            transactionNode = treeSubTree(transactionNode, front);
            path = pathPopFront(path);
            front = pathGetFront(path);
        }
        return transactionNode;
    }
    /**
     * Builds the queue of all transactions at or below the specified
     * transactionNode.
     *
     * @param transactionNode
     * @returns The generated queue.
     */
    function repoBuildTransactionQueue(repo, transactionNode) {
        // Walk any child transaction queues and aggregate them into a single queue.
        const transactionQueue = [];
        repoAggregateTransactionQueuesForNode(repo, transactionNode, transactionQueue);
        // Sort them by the order the transactions were created.
        transactionQueue.sort((a, b) => a.order - b.order);
        return transactionQueue;
    }
    function repoAggregateTransactionQueuesForNode(repo, node, queue) {
        const nodeQueue = treeGetValue(node);
        if (nodeQueue) {
            for (let i = 0; i < nodeQueue.length; i++) {
                queue.push(nodeQueue[i]);
            }
        }
        treeForEachChild(node, child => {
            repoAggregateTransactionQueuesForNode(repo, child, queue);
        });
    }
    /**
     * Remove COMPLETED transactions at or below this node in the transactionQueueTree_.
     */
    function repoPruneCompletedTransactionsBelowNode(repo, node) {
        const queue = treeGetValue(node);
        if (queue) {
            let to = 0;
            for (let from = 0; from < queue.length; from++) {
                if (queue[from].status !== 2 /* TransactionStatus.COMPLETED */) {
                    queue[to] = queue[from];
                    to++;
                }
            }
            queue.length = to;
            treeSetValue(node, queue.length > 0 ? queue : undefined);
        }
        treeForEachChild(node, childNode => {
            repoPruneCompletedTransactionsBelowNode(repo, childNode);
        });
    }
    /**
     * Aborts all transactions on ancestors or descendants of the specified path.
     * Called when doing a set() or update() since we consider them incompatible
     * with transactions.
     *
     * @param path - Path for which we want to abort related transactions.
     */
    function repoAbortTransactions(repo, path) {
        const affectedPath = treeGetPath(repoGetAncestorTransactionNode(repo, path));
        const transactionNode = treeSubTree(repo.transactionQueueTree_, path);
        treeForEachAncestor(transactionNode, (node) => {
            repoAbortTransactionsOnNode(repo, node);
        });
        repoAbortTransactionsOnNode(repo, transactionNode);
        treeForEachDescendant(transactionNode, (node) => {
            repoAbortTransactionsOnNode(repo, node);
        });
        return affectedPath;
    }
    /**
     * Abort transactions stored in this transaction queue node.
     *
     * @param node - Node to abort transactions for.
     */
    function repoAbortTransactionsOnNode(repo, node) {
        const queue = treeGetValue(node);
        if (queue) {
            // Queue up the callbacks and fire them after cleaning up all of our
            // transaction state, since the callback could trigger more transactions
            // or sets.
            const callbacks = [];
            // Go through queue.  Any already-sent transactions must be marked for
            // abort, while the unsent ones can be immediately aborted and removed.
            let events = [];
            let lastSent = -1;
            for (let i = 0; i < queue.length; i++) {
                if (queue[i].status === 3 /* TransactionStatus.SENT_NEEDS_ABORT */) ;
                else if (queue[i].status === 1 /* TransactionStatus.SENT */) {
                    assert(lastSent === i - 1, 'All SENT items should be at beginning of queue.');
                    lastSent = i;
                    // Mark transaction for abort when it comes back.
                    queue[i].status = 3 /* TransactionStatus.SENT_NEEDS_ABORT */;
                    queue[i].abortReason = 'set';
                }
                else {
                    assert(queue[i].status === 0 /* TransactionStatus.RUN */, 'Unexpected transaction status in abort');
                    // We can abort it immediately.
                    queue[i].unwatcher();
                    events = events.concat(syncTreeAckUserWrite(repo.serverSyncTree_, queue[i].currentWriteId, true));
                    if (queue[i].onComplete) {
                        callbacks.push(queue[i].onComplete.bind(null, new Error('set'), false, null));
                    }
                }
            }
            if (lastSent === -1) {
                // We're not waiting for any sent transactions.  We can clear the queue.
                treeSetValue(node, undefined);
            }
            else {
                // Remove the transactions we aborted.
                queue.length = lastSent + 1;
            }
            // Now fire the callbacks.
            eventQueueRaiseEventsForChangedPath(repo.eventQueue_, treeGetPath(node), events);
            for (let i = 0; i < callbacks.length; i++) {
                exceptionGuard(callbacks[i]);
            }
        }
    }

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function decodePath(pathString) {
        let pathStringDecoded = '';
        const pieces = pathString.split('/');
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].length > 0) {
                let piece = pieces[i];
                try {
                    piece = decodeURIComponent(piece.replace(/\+/g, ' '));
                }
                catch (e) { }
                pathStringDecoded += '/' + piece;
            }
        }
        return pathStringDecoded;
    }
    /**
     * @returns key value hash
     */
    function decodeQuery(queryString) {
        const results = {};
        if (queryString.charAt(0) === '?') {
            queryString = queryString.substring(1);
        }
        for (const segment of queryString.split('&')) {
            if (segment.length === 0) {
                continue;
            }
            const kv = segment.split('=');
            if (kv.length === 2) {
                results[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
            }
            else {
                warn(`Invalid query segment '${segment}' in query '${queryString}'`);
            }
        }
        return results;
    }
    const parseRepoInfo = function (dataURL, nodeAdmin) {
        const parsedUrl = parseDatabaseURL(dataURL), namespace = parsedUrl.namespace;
        if (parsedUrl.domain === 'firebase.com') {
            fatal(parsedUrl.host +
                ' is no longer supported. ' +
                'Please use <YOUR FIREBASE>.firebaseio.com instead');
        }
        // Catch common error of uninitialized namespace value.
        if ((!namespace || namespace === 'undefined') &&
            parsedUrl.domain !== 'localhost') {
            fatal('Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com');
        }
        if (!parsedUrl.secure) {
            warnIfPageIsSecure();
        }
        const webSocketOnly = parsedUrl.scheme === 'ws' || parsedUrl.scheme === 'wss';
        return {
            repoInfo: new RepoInfo(parsedUrl.host, parsedUrl.secure, namespace, webSocketOnly, nodeAdmin, 
            /*persistenceKey=*/ '', 
            /*includeNamespaceInQueryParams=*/ namespace !== parsedUrl.subdomain),
            path: new Path(parsedUrl.pathString)
        };
    };
    const parseDatabaseURL = function (dataURL) {
        // Default to empty strings in the event of a malformed string.
        let host = '', domain = '', subdomain = '', pathString = '', namespace = '';
        // Always default to SSL, unless otherwise specified.
        let secure = true, scheme = 'https', port = 443;
        // Don't do any validation here. The caller is responsible for validating the result of parsing.
        if (typeof dataURL === 'string') {
            // Parse scheme.
            let colonInd = dataURL.indexOf('//');
            if (colonInd >= 0) {
                scheme = dataURL.substring(0, colonInd - 1);
                dataURL = dataURL.substring(colonInd + 2);
            }
            // Parse host, path, and query string.
            let slashInd = dataURL.indexOf('/');
            if (slashInd === -1) {
                slashInd = dataURL.length;
            }
            let questionMarkInd = dataURL.indexOf('?');
            if (questionMarkInd === -1) {
                questionMarkInd = dataURL.length;
            }
            host = dataURL.substring(0, Math.min(slashInd, questionMarkInd));
            if (slashInd < questionMarkInd) {
                // For pathString, questionMarkInd will always come after slashInd
                pathString = decodePath(dataURL.substring(slashInd, questionMarkInd));
            }
            const queryParams = decodeQuery(dataURL.substring(Math.min(dataURL.length, questionMarkInd)));
            // If we have a port, use scheme for determining if it's secure.
            colonInd = host.indexOf(':');
            if (colonInd >= 0) {
                secure = scheme === 'https' || scheme === 'wss';
                port = parseInt(host.substring(colonInd + 1), 10);
            }
            else {
                colonInd = host.length;
            }
            const hostWithoutPort = host.slice(0, colonInd);
            if (hostWithoutPort.toLowerCase() === 'localhost') {
                domain = 'localhost';
            }
            else if (hostWithoutPort.split('.').length <= 2) {
                domain = hostWithoutPort;
            }
            else {
                // Interpret the subdomain of a 3 or more component URL as the namespace name.
                const dotInd = host.indexOf('.');
                subdomain = host.substring(0, dotInd).toLowerCase();
                domain = host.substring(dotInd + 1);
                // Normalize namespaces to lowercase to share storage / connection.
                namespace = subdomain;
            }
            // Always treat the value of the `ns` as the namespace name if it is present.
            if ('ns' in queryParams) {
                namespace = queryParams['ns'];
            }
        }
        return {
            host,
            port,
            domain,
            subdomain,
            secure,
            scheme,
            pathString,
            namespace
        };
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    /**
     * Fancy ID generator that creates 20-character string identifiers with the
     * following properties:
     *
     * 1. They're based on timestamp so that they sort *after* any existing ids.
     * 2. They contain 72-bits of random data after the timestamp so that IDs won't
     *    collide with other clients' IDs.
     * 3. They sort *lexicographically* (so the timestamp is converted to characters
     *    that will sort properly).
     * 4. They're monotonically increasing. Even if you generate more than one in
     *    the same timestamp, the latter ones will sort after the former ones. We do
     *    this by using the previous random bits but "incrementing" them by 1 (only
     *    in the case of a timestamp collision).
     */
    const nextPushId = (function () {
        // Timestamp of last push, used to prevent local collisions if you push twice
        // in one ms.
        let lastPushTime = 0;
        // We generate 72-bits of randomness which get turned into 12 characters and
        // appended to the timestamp to prevent collisions with other clients. We
        // store the last characters we generated because in the event of a collision,
        // we'll use those same characters except "incremented" by one.
        const lastRandChars = [];
        return function (now) {
            const duplicateTime = now === lastPushTime;
            lastPushTime = now;
            let i;
            const timeStampChars = new Array(8);
            for (i = 7; i >= 0; i--) {
                timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
                // NOTE: Can't use << here because javascript will convert to int and lose
                // the upper bits.
                now = Math.floor(now / 64);
            }
            assert(now === 0, 'Cannot push at time == 0');
            let id = timeStampChars.join('');
            if (!duplicateTime) {
                for (i = 0; i < 12; i++) {
                    lastRandChars[i] = Math.floor(Math.random() * 64);
                }
            }
            else {
                // If the timestamp hasn't changed since last push, use the same random
                // number, except incremented by 1.
                for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                    lastRandChars[i] = 0;
                }
                lastRandChars[i]++;
            }
            for (i = 0; i < 12; i++) {
                id += PUSH_CHARS.charAt(lastRandChars[i]);
            }
            assert(id.length === 20, 'nextPushId: Length should be 20.');
            return id;
        };
    })();

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * @internal
     */
    class QueryImpl {
        /**
         * @hideconstructor
         */
        constructor(_repo, _path, _queryParams, _orderByCalled) {
            this._repo = _repo;
            this._path = _path;
            this._queryParams = _queryParams;
            this._orderByCalled = _orderByCalled;
        }
        get key() {
            if (pathIsEmpty(this._path)) {
                return null;
            }
            else {
                return pathGetBack(this._path);
            }
        }
        get ref() {
            return new ReferenceImpl(this._repo, this._path);
        }
        get _queryIdentifier() {
            const obj = queryParamsGetQueryObject(this._queryParams);
            const id = ObjectToUniqueKey(obj);
            return id === '{}' ? 'default' : id;
        }
        /**
         * An object representation of the query parameters used by this Query.
         */
        get _queryObject() {
            return queryParamsGetQueryObject(this._queryParams);
        }
        isEqual(other) {
            other = getModularInstance(other);
            if (!(other instanceof QueryImpl)) {
                return false;
            }
            const sameRepo = this._repo === other._repo;
            const samePath = pathEquals(this._path, other._path);
            const sameQueryIdentifier = this._queryIdentifier === other._queryIdentifier;
            return sameRepo && samePath && sameQueryIdentifier;
        }
        toJSON() {
            return this.toString();
        }
        toString() {
            return this._repo.toString() + pathToUrlEncodedString(this._path);
        }
    }
    /**
     * @internal
     */
    class ReferenceImpl extends QueryImpl {
        /** @hideconstructor */
        constructor(repo, path) {
            super(repo, path, new QueryParams(), false);
        }
        get parent() {
            const parentPath = pathParent(this._path);
            return parentPath === null
                ? null
                : new ReferenceImpl(this._repo, parentPath);
        }
        get root() {
            let ref = this;
            while (ref.parent !== null) {
                ref = ref.parent;
            }
            return ref;
        }
    }
    /**
     *
     * Returns a `Reference` representing the location in the Database
     * corresponding to the provided path. If no path is provided, the `Reference`
     * will point to the root of the Database.
     *
     * @param db - The database instance to obtain a reference for.
     * @param path - Optional path representing the location the returned
     *   `Reference` will point. If not provided, the returned `Reference` will
     *   point to the root of the Database.
     * @returns If a path is provided, a `Reference`
     *   pointing to the provided path. Otherwise, a `Reference` pointing to the
     *   root of the Database.
     */
    function ref(db, path) {
        db = getModularInstance(db);
        db._checkNotDeleted('ref');
        return path !== undefined ? child(db._root, path) : db._root;
    }
    /**
     * Gets a `Reference` for the location at the specified relative path.
     *
     * The relative path can either be a simple child name (for example, "ada") or
     * a deeper slash-separated path (for example, "ada/name/first").
     *
     * @param parent - The parent location.
     * @param path - A relative path from this location to the desired child
     *   location.
     * @returns The specified child location.
     */
    function child(parent, path) {
        parent = getModularInstance(parent);
        if (pathGetFront(parent._path) === null) {
            validateRootPathString('child', 'path', path, false);
        }
        else {
            validatePathString('child', 'path', path, false);
        }
        return new ReferenceImpl(parent._repo, pathChild(parent._path, path));
    }
    /**
     * Generates a new child location using a unique key and returns its
     * `Reference`.
     *
     * This is the most common pattern for adding data to a collection of items.
     *
     * If you provide a value to `push()`, the value is written to the
     * generated location. If you don't pass a value, nothing is written to the
     * database and the child remains empty (but you can use the `Reference`
     * elsewhere).
     *
     * The unique keys generated by `push()` are ordered by the current time, so the
     * resulting list of items is chronologically sorted. The keys are also
     * designed to be unguessable (they contain 72 random bits of entropy).
     *
     * See {@link https://firebase.google.com/docs/database/web/lists-of-data#append_to_a_list_of_data | Append to a list of data}.
     * See {@link https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html | The 2^120 Ways to Ensure Unique Identifiers}.
     *
     * @param parent - The parent location.
     * @param value - Optional value to be written at the generated location.
     * @returns Combined `Promise` and `Reference`; resolves when write is complete,
     * but can be used immediately as the `Reference` to the child location.
     */
    function push(parent, value) {
        parent = getModularInstance(parent);
        validateWritablePath('push', parent._path);
        validateFirebaseDataArg('push', value, parent._path, true);
        const now = repoServerTime(parent._repo);
        const name = nextPushId(now);
        // push() returns a ThennableReference whose promise is fulfilled with a
        // regular Reference. We use child() to create handles to two different
        // references. The first is turned into a ThennableReference below by adding
        // then() and catch() methods and is used as the return value of push(). The
        // second remains a regular Reference and is used as the fulfilled value of
        // the first ThennableReference.
        const thennablePushRef = child(parent, name);
        const pushRef = child(parent, name);
        let promise;
        if (value != null) {
            promise = set(pushRef, value).then(() => pushRef);
        }
        else {
            promise = Promise.resolve(pushRef);
        }
        thennablePushRef.then = promise.then.bind(promise);
        thennablePushRef.catch = promise.then.bind(promise, undefined);
        return thennablePushRef;
    }
    /**
     * Writes data to this Database location.
     *
     * This will overwrite any data at this location and all child locations.
     *
     * The effect of the write will be visible immediately, and the corresponding
     * events ("value", "child_added", etc.) will be triggered. Synchronization of
     * the data to the Firebase servers will also be started, and the returned
     * Promise will resolve when complete. If provided, the `onComplete` callback
     * will be called asynchronously after synchronization has finished.
     *
     * Passing `null` for the new value is equivalent to calling `remove()`; namely,
     * all data at this location and all child locations will be deleted.
     *
     * `set()` will remove any priority stored at this location, so if priority is
     * meant to be preserved, you need to use `setWithPriority()` instead.
     *
     * Note that modifying data with `set()` will cancel any pending transactions
     * at that location, so extreme care should be taken if mixing `set()` and
     * `transaction()` to modify the same data.
     *
     * A single `set()` will generate a single "value" event at the location where
     * the `set()` was performed.
     *
     * @param ref - The location to write to.
     * @param value - The value to be written (string, number, boolean, object,
     *   array, or null).
     * @returns Resolves when write to server is complete.
     */
    function set(ref, value) {
        ref = getModularInstance(ref);
        validateWritablePath('set', ref._path);
        validateFirebaseDataArg('set', value, ref._path, false);
        const deferred = new Deferred();
        repoSetWithPriority(ref._repo, ref._path, value, 
        /*priority=*/ null, deferred.wrapCallback(() => { }));
        return deferred.promise;
    }
    /**
     * Define reference constructor in various modules
     *
     * We are doing this here to avoid several circular
     * dependency issues
     */
    syncPointSetReferenceConstructor(ReferenceImpl);
    syncTreeSetReferenceConstructor(ReferenceImpl);

    /**
     * @license
     * Copyright 2020 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * This variable is also defined in the firebase Node.js Admin SDK. Before
     * modifying this definition, consult the definition in:
     *
     * https://github.com/firebase/firebase-admin-node
     *
     * and make sure the two are consistent.
     */
    const FIREBASE_DATABASE_EMULATOR_HOST_VAR = 'FIREBASE_DATABASE_EMULATOR_HOST';
    /**
     * Creates and caches `Repo` instances.
     */
    const repos = {};
    /**
     * If true, any new `Repo` will be created to use `ReadonlyRestClient` (for testing purposes).
     */
    let useRestClient = false;
    /**
     * Update an existing `Repo` in place to point to a new host/port.
     */
    function repoManagerApplyEmulatorSettings(repo, host, port, tokenProvider) {
        repo.repoInfo_ = new RepoInfo(`${host}:${port}`, 
        /* secure= */ false, repo.repoInfo_.namespace, repo.repoInfo_.webSocketOnly, repo.repoInfo_.nodeAdmin, repo.repoInfo_.persistenceKey, repo.repoInfo_.includeNamespaceInQueryParams, 
        /*isUsingEmulator=*/ true);
        if (tokenProvider) {
            repo.authTokenProvider_ = tokenProvider;
        }
    }
    /**
     * This function should only ever be called to CREATE a new database instance.
     * @internal
     */
    function repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url, nodeAdmin) {
        let dbUrl = url || app.options.databaseURL;
        if (dbUrl === undefined) {
            if (!app.options.projectId) {
                fatal("Can't determine Firebase Database URL. Be sure to include " +
                    ' a Project ID when calling firebase.initializeApp().');
            }
            log('Using default host for project ', app.options.projectId);
            dbUrl = `${app.options.projectId}-default-rtdb.firebaseio.com`;
        }
        let parsedUrl = parseRepoInfo(dbUrl, nodeAdmin);
        let repoInfo = parsedUrl.repoInfo;
        let isEmulator;
        let dbEmulatorHost = undefined;
        if (typeof process !== 'undefined' && process.env) {
            dbEmulatorHost = process.env[FIREBASE_DATABASE_EMULATOR_HOST_VAR];
        }
        if (dbEmulatorHost) {
            isEmulator = true;
            dbUrl = `http://${dbEmulatorHost}?ns=${repoInfo.namespace}`;
            parsedUrl = parseRepoInfo(dbUrl, nodeAdmin);
            repoInfo = parsedUrl.repoInfo;
        }
        else {
            isEmulator = !parsedUrl.repoInfo.secure;
        }
        const authTokenProvider = nodeAdmin && isEmulator
            ? new EmulatorTokenProvider(EmulatorTokenProvider.OWNER)
            : new FirebaseAuthTokenProvider(app.name, app.options, authProvider);
        validateUrl('Invalid Firebase Database URL', parsedUrl);
        if (!pathIsEmpty(parsedUrl.path)) {
            fatal('Database URL must point to the root of a Firebase Database ' +
                '(not including a child path).');
        }
        const repo = repoManagerCreateRepo(repoInfo, app, authTokenProvider, new AppCheckTokenProvider(app.name, appCheckProvider));
        return new Database(repo, app);
    }
    /**
     * Remove the repo and make sure it is disconnected.
     *
     */
    function repoManagerDeleteRepo(repo, appName) {
        const appRepos = repos[appName];
        // This should never happen...
        if (!appRepos || appRepos[repo.key] !== repo) {
            fatal(`Database ${appName}(${repo.repoInfo_}) has already been deleted.`);
        }
        repoInterrupt(repo);
        delete appRepos[repo.key];
    }
    /**
     * Ensures a repo doesn't already exist and then creates one using the
     * provided app.
     *
     * @param repoInfo - The metadata about the Repo
     * @returns The Repo object for the specified server / repoName.
     */
    function repoManagerCreateRepo(repoInfo, app, authTokenProvider, appCheckProvider) {
        let appRepos = repos[app.name];
        if (!appRepos) {
            appRepos = {};
            repos[app.name] = appRepos;
        }
        let repo = appRepos[repoInfo.toURLString()];
        if (repo) {
            fatal('Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.');
        }
        repo = new Repo(repoInfo, useRestClient, authTokenProvider, appCheckProvider);
        appRepos[repoInfo.toURLString()] = repo;
        return repo;
    }
    /**
     * Class representing a Firebase Realtime Database.
     */
    class Database {
        /** @hideconstructor */
        constructor(_repoInternal, 
        /** The {@link @firebase/app#FirebaseApp} associated with this Realtime Database instance. */
        app) {
            this._repoInternal = _repoInternal;
            this.app = app;
            /** Represents a `Database` instance. */
            this['type'] = 'database';
            /** Track if the instance has been used (root or repo accessed) */
            this._instanceStarted = false;
        }
        get _repo() {
            if (!this._instanceStarted) {
                repoStart(this._repoInternal, this.app.options.appId, this.app.options['databaseAuthVariableOverride']);
                this._instanceStarted = true;
            }
            return this._repoInternal;
        }
        get _root() {
            if (!this._rootInternal) {
                this._rootInternal = new ReferenceImpl(this._repo, newEmptyPath());
            }
            return this._rootInternal;
        }
        _delete() {
            if (this._rootInternal !== null) {
                repoManagerDeleteRepo(this._repo, this.app.name);
                this._repoInternal = null;
                this._rootInternal = null;
            }
            return Promise.resolve();
        }
        _checkNotDeleted(apiName) {
            if (this._rootInternal === null) {
                fatal('Cannot call ' + apiName + ' on a deleted database.');
            }
        }
    }
    /**
     * Returns the instance of the Realtime Database SDK that is associated
     * with the provided {@link @firebase/app#FirebaseApp}. Initializes a new instance with
     * with default settings if no instance exists or if the existing instance uses
     * a custom database URL.
     *
     * @param app - The {@link @firebase/app#FirebaseApp} instance that the returned Realtime
     * Database instance is associated with.
     * @param url - The URL of the Realtime Database instance to connect to. If not
     * provided, the SDK connects to the default instance of the Firebase App.
     * @returns The `Database` instance of the provided app.
     */
    function getDatabase(app = getApp(), url) {
        const db = _getProvider(app, 'database').getImmediate({
            identifier: url
        });
        if (!db._instanceStarted) {
            const emulator = getDefaultEmulatorHostnameAndPort('database');
            if (emulator) {
                connectDatabaseEmulator(db, ...emulator);
            }
        }
        return db;
    }
    /**
     * Modify the provided instance to communicate with the Realtime Database
     * emulator.
     *
     * <p>Note: This method must be called before performing any other operation.
     *
     * @param db - The instance to modify.
     * @param host - The emulator host (ex: localhost)
     * @param port - The emulator port (ex: 8080)
     * @param options.mockUserToken - the mock auth token to use for unit testing Security Rules
     */
    function connectDatabaseEmulator(db, host, port, options = {}) {
        db = getModularInstance(db);
        db._checkNotDeleted('useEmulator');
        if (db._instanceStarted) {
            fatal('Cannot call useEmulator() after instance has already been initialized.');
        }
        const repo = db._repoInternal;
        let tokenProvider = undefined;
        if (repo.repoInfo_.nodeAdmin) {
            if (options.mockUserToken) {
                fatal('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".');
            }
            tokenProvider = new EmulatorTokenProvider(EmulatorTokenProvider.OWNER);
        }
        else if (options.mockUserToken) {
            const token = typeof options.mockUserToken === 'string'
                ? options.mockUserToken
                : createMockUserToken(options.mockUserToken, db.app.options.projectId);
            tokenProvider = new EmulatorTokenProvider(token);
        }
        // Modify the repo to apply emulator settings
        repoManagerApplyEmulatorSettings(repo, host, port, tokenProvider);
    }

    /**
     * @license
     * Copyright 2021 Google LLC
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *   http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    function registerDatabase(variant) {
        setSDKVersion(SDK_VERSION$1);
        _registerComponent(new Component('database', (container, { instanceIdentifier: url }) => {
            const app = container.getProvider('app').getImmediate();
            const authProvider = container.getProvider('auth-internal');
            const appCheckProvider = container.getProvider('app-check-internal');
            return repoManagerDatabaseFromApp(app, authProvider, appCheckProvider, url);
        }, "PUBLIC" /* ComponentType.PUBLIC */).setMultipleInstances(true));
        registerVersion(name, version, variant);
        // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
        registerVersion(name, version, 'esm2017');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PersistentConnection.prototype.simpleListen = function (pathString, onComplete) {
        this.sendRequest('q', { p: pathString }, onComplete);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PersistentConnection.prototype.echo = function (data, onEcho) {
        this.sendRequest('echo', { d: data }, onEcho);
    };

    /**
     * Firebase Realtime Database
     *
     * @packageDocumentation
     */
    registerDatabase();

    const store = {
        _origin: 'https://api.emailjs.com',
    };

    /**
     * Initiation
     * @param {string} userID - set the EmailJS user ID
     * @param {string} origin - set the EmailJS origin
     */
    const init = (userID, origin = 'https://api.emailjs.com') => {
        store._userID = userID;
        store._origin = origin;
    };

    const validateParams = (userID, serviceID, templateID) => {
        if (!userID) {
            throw 'The user ID is required. Visit https://dashboard.emailjs.com/admin/integration';
        }
        if (!serviceID) {
            throw 'The service ID is required. Visit https://dashboard.emailjs.com/admin';
        }
        if (!templateID) {
            throw 'The template ID is required. Visit https://dashboard.emailjs.com/admin/templates';
        }
        return true;
    };

    class EmailJSResponseStatus {
        constructor(httpResponse) {
            this.status = httpResponse.status;
            this.text = httpResponse.responseText;
        }
    }

    const sendPost = (url, data, headers = {}) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener('load', ({ target }) => {
                const responseStatus = new EmailJSResponseStatus(target);
                if (responseStatus.status === 200 || responseStatus.text === 'OK') {
                    resolve(responseStatus);
                }
                else {
                    reject(responseStatus);
                }
            });
            xhr.addEventListener('error', ({ target }) => {
                reject(new EmailJSResponseStatus(target));
            });
            xhr.open('POST', store._origin + url, true);
            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });
            xhr.send(data);
        });
    };

    /**
     * Send a template to the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {object} templatePrams - the template params, what will be set to the EmailJS template
     * @param {string} userID - the EmailJS user ID
     * @returns {Promise<EmailJSResponseStatus>}
     */
    const send = (serviceID, templateID, templatePrams, userID) => {
        const uID = userID || store._userID;
        validateParams(uID, serviceID, templateID);
        const params = {
            lib_version: '3.2.0',
            user_id: uID,
            service_id: serviceID,
            template_id: templateID,
            template_params: templatePrams,
        };
        return sendPost('/api/v1.0/email/send', JSON.stringify(params), {
            'Content-type': 'application/json',
        });
    };

    const findHTMLForm = (form) => {
        let currentForm;
        if (typeof form === 'string') {
            currentForm = document.querySelector(form);
        }
        else {
            currentForm = form;
        }
        if (!currentForm || currentForm.nodeName !== 'FORM') {
            throw 'The 3rd parameter is expected to be the HTML form element or the style selector of form';
        }
        return currentForm;
    };
    /**
     * Send a form the specific EmailJS service
     * @param {string} serviceID - the EmailJS service ID
     * @param {string} templateID - the EmailJS template ID
     * @param {string | HTMLFormElement} form - the form element or selector
     * @param {string} userID - the EmailJS user ID
     * @returns {Promise<EmailJSResponseStatus>}
     */
    const sendForm = (serviceID, templateID, form, userID) => {
        const uID = userID || store._userID;
        const currentForm = findHTMLForm(form);
        validateParams(uID, serviceID, templateID);
        const formData = new FormData(currentForm);
        formData.append('lib_version', '3.2.0');
        formData.append('service_id', serviceID);
        formData.append('template_id', templateID);
        formData.append('user_id', uID);
        return sendPost('/api/v1.0/email/send-form', formData);
    };

    var emailjs = {
        init,
        send,
        sendForm,
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var sweetalert2_all = {exports: {}};

    /*!
    * sweetalert2 v11.9.0
    * Released under the MIT License.
    */

    (function (module, exports) {
    	(function (global, factory) {
    	  module.exports = factory() ;
    	})(commonjsGlobal, (function () {
    	  function _classPrivateFieldGet(receiver, privateMap) {
    	    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
    	    return _classApplyDescriptorGet(receiver, descriptor);
    	  }
    	  function _classPrivateFieldSet(receiver, privateMap, value) {
    	    var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
    	    _classApplyDescriptorSet(receiver, descriptor, value);
    	    return value;
    	  }
    	  function _classExtractFieldDescriptor(receiver, privateMap, action) {
    	    if (!privateMap.has(receiver)) {
    	      throw new TypeError("attempted to " + action + " private field on non-instance");
    	    }
    	    return privateMap.get(receiver);
    	  }
    	  function _classApplyDescriptorGet(receiver, descriptor) {
    	    if (descriptor.get) {
    	      return descriptor.get.call(receiver);
    	    }
    	    return descriptor.value;
    	  }
    	  function _classApplyDescriptorSet(receiver, descriptor, value) {
    	    if (descriptor.set) {
    	      descriptor.set.call(receiver, value);
    	    } else {
    	      if (!descriptor.writable) {
    	        throw new TypeError("attempted to set read only private field");
    	      }
    	      descriptor.value = value;
    	    }
    	  }
    	  function _checkPrivateRedeclaration(obj, privateCollection) {
    	    if (privateCollection.has(obj)) {
    	      throw new TypeError("Cannot initialize the same private elements twice on an object");
    	    }
    	  }
    	  function _classPrivateFieldInitSpec(obj, privateMap, value) {
    	    _checkPrivateRedeclaration(obj, privateMap);
    	    privateMap.set(obj, value);
    	  }

    	  const RESTORE_FOCUS_TIMEOUT = 100;

    	  /** @type {GlobalState} */
    	  const globalState = {};
    	  const focusPreviousActiveElement = () => {
    	    if (globalState.previousActiveElement instanceof HTMLElement) {
    	      globalState.previousActiveElement.focus();
    	      globalState.previousActiveElement = null;
    	    } else if (document.body) {
    	      document.body.focus();
    	    }
    	  };

    	  /**
    	   * Restore previous active (focused) element
    	   *
    	   * @param {boolean} returnFocus
    	   * @returns {Promise<void>}
    	   */
    	  const restoreActiveElement = returnFocus => {
    	    return new Promise(resolve => {
    	      if (!returnFocus) {
    	        return resolve();
    	      }
    	      const x = window.scrollX;
    	      const y = window.scrollY;
    	      globalState.restoreFocusTimeout = setTimeout(() => {
    	        focusPreviousActiveElement();
    	        resolve();
    	      }, RESTORE_FOCUS_TIMEOUT); // issues/900

    	      window.scrollTo(x, y);
    	    });
    	  };

    	  const swalPrefix = 'swal2-';

    	  /**
    	   * @typedef
    	   * { | 'container'
    	   *   | 'shown'
    	   *   | 'height-auto'
    	   *   | 'iosfix'
    	   *   | 'popup'
    	   *   | 'modal'
    	   *   | 'no-backdrop'
    	   *   | 'no-transition'
    	   *   | 'toast'
    	   *   | 'toast-shown'
    	   *   | 'show'
    	   *   | 'hide'
    	   *   | 'close'
    	   *   | 'title'
    	   *   | 'html-container'
    	   *   | 'actions'
    	   *   | 'confirm'
    	   *   | 'deny'
    	   *   | 'cancel'
    	   *   | 'default-outline'
    	   *   | 'footer'
    	   *   | 'icon'
    	   *   | 'icon-content'
    	   *   | 'image'
    	   *   | 'input'
    	   *   | 'file'
    	   *   | 'range'
    	   *   | 'select'
    	   *   | 'radio'
    	   *   | 'checkbox'
    	   *   | 'label'
    	   *   | 'textarea'
    	   *   | 'inputerror'
    	   *   | 'input-label'
    	   *   | 'validation-message'
    	   *   | 'progress-steps'
    	   *   | 'active-progress-step'
    	   *   | 'progress-step'
    	   *   | 'progress-step-line'
    	   *   | 'loader'
    	   *   | 'loading'
    	   *   | 'styled'
    	   *   | 'top'
    	   *   | 'top-start'
    	   *   | 'top-end'
    	   *   | 'top-left'
    	   *   | 'top-right'
    	   *   | 'center'
    	   *   | 'center-start'
    	   *   | 'center-end'
    	   *   | 'center-left'
    	   *   | 'center-right'
    	   *   | 'bottom'
    	   *   | 'bottom-start'
    	   *   | 'bottom-end'
    	   *   | 'bottom-left'
    	   *   | 'bottom-right'
    	   *   | 'grow-row'
    	   *   | 'grow-column'
    	   *   | 'grow-fullscreen'
    	   *   | 'rtl'
    	   *   | 'timer-progress-bar'
    	   *   | 'timer-progress-bar-container'
    	   *   | 'scrollbar-measure'
    	   *   | 'icon-success'
    	   *   | 'icon-warning'
    	   *   | 'icon-info'
    	   *   | 'icon-question'
    	   *   | 'icon-error'
    	   * } SwalClass
    	   * @typedef {Record<SwalClass, string>} SwalClasses
    	   */

    	  /**
    	   * @typedef {'success' | 'warning' | 'info' | 'question' | 'error'} SwalIcon
    	   * @typedef {Record<SwalIcon, string>} SwalIcons
    	   */

    	  /** @type {SwalClass[]} */
    	  const classNames = ['container', 'shown', 'height-auto', 'iosfix', 'popup', 'modal', 'no-backdrop', 'no-transition', 'toast', 'toast-shown', 'show', 'hide', 'close', 'title', 'html-container', 'actions', 'confirm', 'deny', 'cancel', 'default-outline', 'footer', 'icon', 'icon-content', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'label', 'textarea', 'inputerror', 'input-label', 'validation-message', 'progress-steps', 'active-progress-step', 'progress-step', 'progress-step-line', 'loader', 'loading', 'styled', 'top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right', 'grow-row', 'grow-column', 'grow-fullscreen', 'rtl', 'timer-progress-bar', 'timer-progress-bar-container', 'scrollbar-measure', 'icon-success', 'icon-warning', 'icon-info', 'icon-question', 'icon-error'];
    	  const swalClasses = classNames.reduce((acc, className) => {
    	    acc[className] = swalPrefix + className;
    	    return acc;
    	  }, /** @type {SwalClasses} */{});

    	  /** @type {SwalIcon[]} */
    	  const icons = ['success', 'warning', 'info', 'question', 'error'];
    	  const iconTypes = icons.reduce((acc, icon) => {
    	    acc[icon] = swalPrefix + icon;
    	    return acc;
    	  }, /** @type {SwalIcons} */{});

    	  const consolePrefix = 'SweetAlert2:';

    	  /**
    	   * Capitalize the first letter of a string
    	   *
    	   * @param {string} str
    	   * @returns {string}
    	   */
    	  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

    	  /**
    	   * Standardize console warnings
    	   *
    	   * @param {string | string[]} message
    	   */
    	  const warn = message => {
    	    console.warn("".concat(consolePrefix, " ").concat(typeof message === 'object' ? message.join(' ') : message));
    	  };

    	  /**
    	   * Standardize console errors
    	   *
    	   * @param {string} message
    	   */
    	  const error = message => {
    	    console.error("".concat(consolePrefix, " ").concat(message));
    	  };

    	  /**
    	   * Private global state for `warnOnce`
    	   *
    	   * @type {string[]}
    	   * @private
    	   */
    	  const previousWarnOnceMessages = [];

    	  /**
    	   * Show a console warning, but only if it hasn't already been shown
    	   *
    	   * @param {string} message
    	   */
    	  const warnOnce = message => {
    	    if (!previousWarnOnceMessages.includes(message)) {
    	      previousWarnOnceMessages.push(message);
    	      warn(message);
    	    }
    	  };

    	  /**
    	   * Show a one-time console warning about deprecated params/methods
    	   *
    	   * @param {string} deprecatedParam
    	   * @param {string} useInstead
    	   */
    	  const warnAboutDeprecation = (deprecatedParam, useInstead) => {
    	    warnOnce("\"".concat(deprecatedParam, "\" is deprecated and will be removed in the next major release. Please use \"").concat(useInstead, "\" instead."));
    	  };

    	  /**
    	   * If `arg` is a function, call it (with no arguments or context) and return the result.
    	   * Otherwise, just pass the value through
    	   *
    	   * @param {Function | any} arg
    	   * @returns {any}
    	   */
    	  const callIfFunction = arg => typeof arg === 'function' ? arg() : arg;

    	  /**
    	   * @param {any} arg
    	   * @returns {boolean}
    	   */
    	  const hasToPromiseFn = arg => arg && typeof arg.toPromise === 'function';

    	  /**
    	   * @param {any} arg
    	   * @returns {Promise<any>}
    	   */
    	  const asPromise = arg => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);

    	  /**
    	   * @param {any} arg
    	   * @returns {boolean}
    	   */
    	  const isPromise = arg => arg && Promise.resolve(arg) === arg;

    	  /**
    	   * Gets the popup container which contains the backdrop and the popup itself.
    	   *
    	   * @returns {HTMLElement | null}
    	   */
    	  const getContainer = () => document.body.querySelector(".".concat(swalClasses.container));

    	  /**
    	   * @param {string} selectorString
    	   * @returns {HTMLElement | null}
    	   */
    	  const elementBySelector = selectorString => {
    	    const container = getContainer();
    	    return container ? container.querySelector(selectorString) : null;
    	  };

    	  /**
    	   * @param {string} className
    	   * @returns {HTMLElement | null}
    	   */
    	  const elementByClass = className => {
    	    return elementBySelector(".".concat(className));
    	  };

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getPopup = () => elementByClass(swalClasses.popup);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getIcon = () => elementByClass(swalClasses.icon);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getIconContent = () => elementByClass(swalClasses['icon-content']);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getTitle = () => elementByClass(swalClasses.title);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getHtmlContainer = () => elementByClass(swalClasses['html-container']);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getImage = () => elementByClass(swalClasses.image);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getProgressSteps = () => elementByClass(swalClasses['progress-steps']);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getValidationMessage = () => elementByClass(swalClasses['validation-message']);

    	  /**
    	   * @returns {HTMLButtonElement | null}
    	   */
    	  const getConfirmButton = () => /** @type {HTMLButtonElement} */elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));

    	  /**
    	   * @returns {HTMLButtonElement | null}
    	   */
    	  const getCancelButton = () => /** @type {HTMLButtonElement} */elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));

    	  /**
    	   * @returns {HTMLButtonElement | null}
    	   */
    	  const getDenyButton = () => /** @type {HTMLButtonElement} */elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getInputLabel = () => elementByClass(swalClasses['input-label']);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getLoader = () => elementBySelector(".".concat(swalClasses.loader));

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getActions = () => elementByClass(swalClasses.actions);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getFooter = () => elementByClass(swalClasses.footer);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getTimerProgressBar = () => elementByClass(swalClasses['timer-progress-bar']);

    	  /**
    	   * @returns {HTMLElement | null}
    	   */
    	  const getCloseButton = () => elementByClass(swalClasses.close);

    	  // https://github.com/jkup/focusable/blob/master/index.js
    	  const focusable = "\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex=\"0\"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n";
    	  /**
    	   * @returns {HTMLElement[]}
    	   */
    	  const getFocusableElements = () => {
    	    const popup = getPopup();
    	    if (!popup) {
    	      return [];
    	    }
    	    /** @type {NodeListOf<HTMLElement>} */
    	    const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
    	    const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex)
    	    // sort according to tabindex
    	    .sort((a, b) => {
    	      const tabindexA = parseInt(a.getAttribute('tabindex') || '0');
    	      const tabindexB = parseInt(b.getAttribute('tabindex') || '0');
    	      if (tabindexA > tabindexB) {
    	        return 1;
    	      } else if (tabindexA < tabindexB) {
    	        return -1;
    	      }
    	      return 0;
    	    });

    	    /** @type {NodeListOf<HTMLElement>} */
    	    const otherFocusableElements = popup.querySelectorAll(focusable);
    	    const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter(el => el.getAttribute('tabindex') !== '-1');
    	    return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter(el => isVisible$1(el));
    	  };

    	  /**
    	   * @returns {boolean}
    	   */
    	  const isModal = () => {
    	    return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses['toast-shown']) && !hasClass(document.body, swalClasses['no-backdrop']);
    	  };

    	  /**
    	   * @returns {boolean}
    	   */
    	  const isToast = () => {
    	    const popup = getPopup();
    	    if (!popup) {
    	      return false;
    	    }
    	    return hasClass(popup, swalClasses.toast);
    	  };

    	  /**
    	   * @returns {boolean}
    	   */
    	  const isLoading = () => {
    	    const popup = getPopup();
    	    if (!popup) {
    	      return false;
    	    }
    	    return popup.hasAttribute('data-loading');
    	  };

    	  /**
    	   * Securely set innerHTML of an element
    	   * https://github.com/sweetalert2/sweetalert2/issues/1926
    	   *
    	   * @param {HTMLElement} elem
    	   * @param {string} html
    	   */
    	  const setInnerHtml = (elem, html) => {
    	    elem.textContent = '';
    	    if (html) {
    	      const parser = new DOMParser();
    	      const parsed = parser.parseFromString(html, "text/html");
    	      const head = parsed.querySelector('head');
    	      head && Array.from(head.childNodes).forEach(child => {
    	        elem.appendChild(child);
    	      });
    	      const body = parsed.querySelector('body');
    	      body && Array.from(body.childNodes).forEach(child => {
    	        if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
    	          elem.appendChild(child.cloneNode(true)); // https://github.com/sweetalert2/sweetalert2/issues/2507
    	        } else {
    	          elem.appendChild(child);
    	        }
    	      });
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} elem
    	   * @param {string} className
    	   * @returns {boolean}
    	   */
    	  const hasClass = (elem, className) => {
    	    if (!className) {
    	      return false;
    	    }
    	    const classList = className.split(/\s+/);
    	    for (let i = 0; i < classList.length; i++) {
    	      if (!elem.classList.contains(classList[i])) {
    	        return false;
    	      }
    	    }
    	    return true;
    	  };

    	  /**
    	   * @param {HTMLElement} elem
    	   * @param {SweetAlertOptions} params
    	   */
    	  const removeCustomClasses = (elem, params) => {
    	    Array.from(elem.classList).forEach(className => {
    	      if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
    	        elem.classList.remove(className);
    	      }
    	    });
    	  };

    	  /**
    	   * @param {HTMLElement} elem
    	   * @param {SweetAlertOptions} params
    	   * @param {string} className
    	   */
    	  const applyCustomClass = (elem, params, className) => {
    	    removeCustomClasses(elem, params);
    	    if (params.customClass && params.customClass[className]) {
    	      if (typeof params.customClass[className] !== 'string' && !params.customClass[className].forEach) {
    	        warn("Invalid type of customClass.".concat(className, "! Expected string or iterable object, got \"").concat(typeof params.customClass[className], "\""));
    	        return;
    	      }
    	      addClass(elem, params.customClass[className]);
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} popup
    	   * @param {import('./renderers/renderInput').InputClass | SweetAlertInput} inputClass
    	   * @returns {HTMLInputElement | null}
    	   */
    	  const getInput$1 = (popup, inputClass) => {
    	    if (!inputClass) {
    	      return null;
    	    }
    	    switch (inputClass) {
    	      case 'select':
    	      case 'textarea':
    	      case 'file':
    	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses[inputClass]));
    	      case 'checkbox':
    	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.checkbox, " input"));
    	      case 'radio':
    	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:checked")) || popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.radio, " input:first-child"));
    	      case 'range':
    	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.range, " input"));
    	      default:
    	        return popup.querySelector(".".concat(swalClasses.popup, " > .").concat(swalClasses.input));
    	    }
    	  };

    	  /**
    	   * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} input
    	   */
    	  const focusInput = input => {
    	    input.focus();

    	    // place cursor at end of text in text input
    	    if (input.type !== 'file') {
    	      // http://stackoverflow.com/a/2345915
    	      const val = input.value;
    	      input.value = '';
    	      input.value = val;
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement | HTMLElement[] | null} target
    	   * @param {string | string[] | readonly string[] | undefined} classList
    	   * @param {boolean} condition
    	   */
    	  const toggleClass = (target, classList, condition) => {
    	    if (!target || !classList) {
    	      return;
    	    }
    	    if (typeof classList === 'string') {
    	      classList = classList.split(/\s+/).filter(Boolean);
    	    }
    	    classList.forEach(className => {
    	      if (Array.isArray(target)) {
    	        target.forEach(elem => {
    	          condition ? elem.classList.add(className) : elem.classList.remove(className);
    	        });
    	      } else {
    	        condition ? target.classList.add(className) : target.classList.remove(className);
    	      }
    	    });
    	  };

    	  /**
    	   * @param {HTMLElement | HTMLElement[] | null} target
    	   * @param {string | string[] | readonly string[] | undefined} classList
    	   */
    	  const addClass = (target, classList) => {
    	    toggleClass(target, classList, true);
    	  };

    	  /**
    	   * @param {HTMLElement | HTMLElement[] | null} target
    	   * @param {string | string[] | readonly string[] | undefined} classList
    	   */
    	  const removeClass = (target, classList) => {
    	    toggleClass(target, classList, false);
    	  };

    	  /**
    	   * Get direct child of an element by class name
    	   *
    	   * @param {HTMLElement} elem
    	   * @param {string} className
    	   * @returns {HTMLElement | undefined}
    	   */
    	  const getDirectChildByClass = (elem, className) => {
    	    const children = Array.from(elem.children);
    	    for (let i = 0; i < children.length; i++) {
    	      const child = children[i];
    	      if (child instanceof HTMLElement && hasClass(child, className)) {
    	        return child;
    	      }
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} elem
    	   * @param {string} property
    	   * @param {*} value
    	   */
    	  const applyNumericalStyle = (elem, property, value) => {
    	    if (value === "".concat(parseInt(value))) {
    	      value = parseInt(value);
    	    }
    	    if (value || parseInt(value) === 0) {
    	      elem.style[property] = typeof value === 'number' ? "".concat(value, "px") : value;
    	    } else {
    	      elem.style.removeProperty(property);
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement | null} elem
    	   * @param {string} display
    	   */
    	  const show = function (elem) {
    	    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'flex';
    	    elem && (elem.style.display = display);
    	  };

    	  /**
    	   * @param {HTMLElement | null} elem
    	   */
    	  const hide = elem => {
    	    elem && (elem.style.display = 'none');
    	  };

    	  /**
    	   * @param {HTMLElement | null} elem
    	   * @param {string} display
    	   */
    	  const showWhenInnerHtmlPresent = function (elem) {
    	    let display = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
    	    if (!elem) {
    	      return;
    	    }
    	    new MutationObserver(() => {
    	      toggle(elem, elem.innerHTML, display);
    	    }).observe(elem, {
    	      childList: true,
    	      subtree: true
    	    });
    	  };

    	  /**
    	   * @param {HTMLElement} parent
    	   * @param {string} selector
    	   * @param {string} property
    	   * @param {string} value
    	   */
    	  const setStyle = (parent, selector, property, value) => {
    	    /** @type {HTMLElement} */
    	    const el = parent.querySelector(selector);
    	    if (el) {
    	      el.style[property] = value;
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} elem
    	   * @param {any} condition
    	   * @param {string} display
    	   */
    	  const toggle = function (elem, condition) {
    	    let display = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'flex';
    	    condition ? show(elem, display) : hide(elem);
    	  };

    	  /**
    	   * borrowed from jquery $(elem).is(':visible') implementation
    	   *
    	   * @param {HTMLElement | null} elem
    	   * @returns {boolean}
    	   */
    	  const isVisible$1 = elem => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));

    	  /**
    	   * @returns {boolean}
    	   */
    	  const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());

    	  /**
    	   * @param {HTMLElement} elem
    	   * @returns {boolean}
    	   */
    	  const isScrollable = elem => !!(elem.scrollHeight > elem.clientHeight);

    	  /**
    	   * borrowed from https://stackoverflow.com/a/46352119
    	   *
    	   * @param {HTMLElement} elem
    	   * @returns {boolean}
    	   */
    	  const hasCssAnimation = elem => {
    	    const style = window.getComputedStyle(elem);
    	    const animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');
    	    const transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');
    	    return animDuration > 0 || transDuration > 0;
    	  };

    	  /**
    	   * @param {number} timer
    	   * @param {boolean} reset
    	   */
    	  const animateTimerProgressBar = function (timer) {
    	    let reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    	    const timerProgressBar = getTimerProgressBar();
    	    if (!timerProgressBar) {
    	      return;
    	    }
    	    if (isVisible$1(timerProgressBar)) {
    	      if (reset) {
    	        timerProgressBar.style.transition = 'none';
    	        timerProgressBar.style.width = '100%';
    	      }
    	      setTimeout(() => {
    	        timerProgressBar.style.transition = "width ".concat(timer / 1000, "s linear");
    	        timerProgressBar.style.width = '0%';
    	      }, 10);
    	    }
    	  };
    	  const stopTimerProgressBar = () => {
    	    const timerProgressBar = getTimerProgressBar();
    	    if (!timerProgressBar) {
    	      return;
    	    }
    	    const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    	    timerProgressBar.style.removeProperty('transition');
    	    timerProgressBar.style.width = '100%';
    	    const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
    	    const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
    	    timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
    	  };

    	  /**
    	   * Detect Node env
    	   *
    	   * @returns {boolean}
    	   */
    	  const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined';

    	  const sweetHTML = "\n <div aria-labelledby=\"".concat(swalClasses.title, "\" aria-describedby=\"").concat(swalClasses['html-container'], "\" class=\"").concat(swalClasses.popup, "\" tabindex=\"-1\">\n   <button type=\"button\" class=\"").concat(swalClasses.close, "\"></button>\n   <ul class=\"").concat(swalClasses['progress-steps'], "\"></ul>\n   <div class=\"").concat(swalClasses.icon, "\"></div>\n   <img class=\"").concat(swalClasses.image, "\" />\n   <h2 class=\"").concat(swalClasses.title, "\" id=\"").concat(swalClasses.title, "\"></h2>\n   <div class=\"").concat(swalClasses['html-container'], "\" id=\"").concat(swalClasses['html-container'], "\"></div>\n   <input class=\"").concat(swalClasses.input, "\" id=\"").concat(swalClasses.input, "\" />\n   <input type=\"file\" class=\"").concat(swalClasses.file, "\" />\n   <div class=\"").concat(swalClasses.range, "\">\n     <input type=\"range\" />\n     <output></output>\n   </div>\n   <select class=\"").concat(swalClasses.select, "\" id=\"").concat(swalClasses.select, "\"></select>\n   <div class=\"").concat(swalClasses.radio, "\"></div>\n   <label class=\"").concat(swalClasses.checkbox, "\">\n     <input type=\"checkbox\" id=\"").concat(swalClasses.checkbox, "\" />\n     <span class=\"").concat(swalClasses.label, "\"></span>\n   </label>\n   <textarea class=\"").concat(swalClasses.textarea, "\" id=\"").concat(swalClasses.textarea, "\"></textarea>\n   <div class=\"").concat(swalClasses['validation-message'], "\" id=\"").concat(swalClasses['validation-message'], "\"></div>\n   <div class=\"").concat(swalClasses.actions, "\">\n     <div class=\"").concat(swalClasses.loader, "\"></div>\n     <button type=\"button\" class=\"").concat(swalClasses.confirm, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.deny, "\"></button>\n     <button type=\"button\" class=\"").concat(swalClasses.cancel, "\"></button>\n   </div>\n   <div class=\"").concat(swalClasses.footer, "\"></div>\n   <div class=\"").concat(swalClasses['timer-progress-bar-container'], "\">\n     <div class=\"").concat(swalClasses['timer-progress-bar'], "\"></div>\n   </div>\n </div>\n").replace(/(^|\n)\s*/g, '');

    	  /**
    	   * @returns {boolean}
    	   */
    	  const resetOldContainer = () => {
    	    const oldContainer = getContainer();
    	    if (!oldContainer) {
    	      return false;
    	    }
    	    oldContainer.remove();
    	    removeClass([document.documentElement, document.body], [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]);
    	    return true;
    	  };
    	  const resetValidationMessage$1 = () => {
    	    globalState.currentInstance.resetValidationMessage();
    	  };
    	  const addInputChangeListeners = () => {
    	    const popup = getPopup();
    	    const input = getDirectChildByClass(popup, swalClasses.input);
    	    const file = getDirectChildByClass(popup, swalClasses.file);
    	    /** @type {HTMLInputElement} */
    	    const range = popup.querySelector(".".concat(swalClasses.range, " input"));
    	    /** @type {HTMLOutputElement} */
    	    const rangeOutput = popup.querySelector(".".concat(swalClasses.range, " output"));
    	    const select = getDirectChildByClass(popup, swalClasses.select);
    	    /** @type {HTMLInputElement} */
    	    const checkbox = popup.querySelector(".".concat(swalClasses.checkbox, " input"));
    	    const textarea = getDirectChildByClass(popup, swalClasses.textarea);
    	    input.oninput = resetValidationMessage$1;
    	    file.onchange = resetValidationMessage$1;
    	    select.onchange = resetValidationMessage$1;
    	    checkbox.onchange = resetValidationMessage$1;
    	    textarea.oninput = resetValidationMessage$1;
    	    range.oninput = () => {
    	      resetValidationMessage$1();
    	      rangeOutput.value = range.value;
    	    };
    	    range.onchange = () => {
    	      resetValidationMessage$1();
    	      rangeOutput.value = range.value;
    	    };
    	  };

    	  /**
    	   * @param {string | HTMLElement} target
    	   * @returns {HTMLElement}
    	   */
    	  const getTarget = target => typeof target === 'string' ? document.querySelector(target) : target;

    	  /**
    	   * @param {SweetAlertOptions} params
    	   */
    	  const setupAccessibility = params => {
    	    const popup = getPopup();
    	    popup.setAttribute('role', params.toast ? 'alert' : 'dialog');
    	    popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive');
    	    if (!params.toast) {
    	      popup.setAttribute('aria-modal', 'true');
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} targetElement
    	   */
    	  const setupRTL = targetElement => {
    	    if (window.getComputedStyle(targetElement).direction === 'rtl') {
    	      addClass(getContainer(), swalClasses.rtl);
    	    }
    	  };

    	  /**
    	   * Add modal + backdrop + no-war message for Russians to DOM
    	   *
    	   * @param {SweetAlertOptions} params
    	   */
    	  const init = params => {
    	    // Clean up the old popup container if it exists
    	    const oldContainerExisted = resetOldContainer();
    	    if (isNodeEnv()) {
    	      error('SweetAlert2 requires document to initialize');
    	      return;
    	    }
    	    const container = document.createElement('div');
    	    container.className = swalClasses.container;
    	    if (oldContainerExisted) {
    	      addClass(container, swalClasses['no-transition']);
    	    }
    	    setInnerHtml(container, sweetHTML);
    	    const targetElement = getTarget(params.target);
    	    targetElement.appendChild(container);
    	    setupAccessibility(params);
    	    setupRTL(targetElement);
    	    addInputChangeListeners();
    	  };

    	  /**
    	   * @param {HTMLElement | object | string} param
    	   * @param {HTMLElement} target
    	   */
    	  const parseHtmlToContainer = (param, target) => {
    	    // DOM element
    	    if (param instanceof HTMLElement) {
    	      target.appendChild(param);
    	    }

    	    // Object
    	    else if (typeof param === 'object') {
    	      handleObject(param, target);
    	    }

    	    // Plain string
    	    else if (param) {
    	      setInnerHtml(target, param);
    	    }
    	  };

    	  /**
    	   * @param {any} param
    	   * @param {HTMLElement} target
    	   */
    	  const handleObject = (param, target) => {
    	    // JQuery element(s)
    	    if (param.jquery) {
    	      handleJqueryElem(target, param);
    	    }

    	    // For other objects use their string representation
    	    else {
    	      setInnerHtml(target, param.toString());
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} target
    	   * @param {any} elem
    	   */
    	  const handleJqueryElem = (target, elem) => {
    	    target.textContent = '';
    	    if (0 in elem) {
    	      for (let i = 0; (i in elem); i++) {
    	        target.appendChild(elem[i].cloneNode(true));
    	      }
    	    } else {
    	      target.appendChild(elem.cloneNode(true));
    	    }
    	  };

    	  /**
    	   * @returns {'webkitAnimationEnd' | 'animationend' | false}
    	   */
    	  const animationEndEvent = (() => {
    	    // Prevent run in Node env
    	    if (isNodeEnv()) {
    	      return false;
    	    }
    	    const testEl = document.createElement('div');

    	    // Chrome, Safari and Opera
    	    if (typeof testEl.style.webkitAnimation !== 'undefined') {
    	      return 'webkitAnimationEnd';
    	    }

    	    // Standard syntax
    	    if (typeof testEl.style.animation !== 'undefined') {
    	      return 'animationend';
    	    }
    	    return false;
    	  })();

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderActions = (instance, params) => {
    	    const actions = getActions();
    	    const loader = getLoader();
    	    if (!actions || !loader) {
    	      return;
    	    }

    	    // Actions (buttons) wrapper
    	    if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
    	      hide(actions);
    	    } else {
    	      show(actions);
    	    }

    	    // Custom class
    	    applyCustomClass(actions, params, 'actions');

    	    // Render all the buttons
    	    renderButtons(actions, loader, params);

    	    // Loader
    	    setInnerHtml(loader, params.loaderHtml || '');
    	    applyCustomClass(loader, params, 'loader');
    	  };

    	  /**
    	   * @param {HTMLElement} actions
    	   * @param {HTMLElement} loader
    	   * @param {SweetAlertOptions} params
    	   */
    	  function renderButtons(actions, loader, params) {
    	    const confirmButton = getConfirmButton();
    	    const denyButton = getDenyButton();
    	    const cancelButton = getCancelButton();
    	    if (!confirmButton || !denyButton || !cancelButton) {
    	      return;
    	    }

    	    // Render buttons
    	    renderButton(confirmButton, 'confirm', params);
    	    renderButton(denyButton, 'deny', params);
    	    renderButton(cancelButton, 'cancel', params);
    	    handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
    	    if (params.reverseButtons) {
    	      if (params.toast) {
    	        actions.insertBefore(cancelButton, confirmButton);
    	        actions.insertBefore(denyButton, confirmButton);
    	      } else {
    	        actions.insertBefore(cancelButton, loader);
    	        actions.insertBefore(denyButton, loader);
    	        actions.insertBefore(confirmButton, loader);
    	      }
    	    }
    	  }

    	  /**
    	   * @param {HTMLElement} confirmButton
    	   * @param {HTMLElement} denyButton
    	   * @param {HTMLElement} cancelButton
    	   * @param {SweetAlertOptions} params
    	   */
    	  function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
    	    if (!params.buttonsStyling) {
    	      removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
    	      return;
    	    }
    	    addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);

    	    // Buttons background colors
    	    if (params.confirmButtonColor) {
    	      confirmButton.style.backgroundColor = params.confirmButtonColor;
    	      addClass(confirmButton, swalClasses['default-outline']);
    	    }
    	    if (params.denyButtonColor) {
    	      denyButton.style.backgroundColor = params.denyButtonColor;
    	      addClass(denyButton, swalClasses['default-outline']);
    	    }
    	    if (params.cancelButtonColor) {
    	      cancelButton.style.backgroundColor = params.cancelButtonColor;
    	      addClass(cancelButton, swalClasses['default-outline']);
    	    }
    	  }

    	  /**
    	   * @param {HTMLElement} button
    	   * @param {'confirm' | 'deny' | 'cancel'} buttonType
    	   * @param {SweetAlertOptions} params
    	   */
    	  function renderButton(button, buttonType, params) {
    	    const buttonName = /** @type {'Confirm' | 'Deny' | 'Cancel'} */capitalizeFirstLetter(buttonType);
    	    toggle(button, params["show".concat(buttonName, "Button")], 'inline-block');
    	    setInnerHtml(button, params["".concat(buttonType, "ButtonText")] || ''); // Set caption text
    	    button.setAttribute('aria-label', params["".concat(buttonType, "ButtonAriaLabel")] || ''); // ARIA label

    	    // Add buttons custom classes
    	    button.className = swalClasses[buttonType];
    	    applyCustomClass(button, params, "".concat(buttonType, "Button"));
    	  }

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderCloseButton = (instance, params) => {
    	    const closeButton = getCloseButton();
    	    if (!closeButton) {
    	      return;
    	    }
    	    setInnerHtml(closeButton, params.closeButtonHtml || '');

    	    // Custom class
    	    applyCustomClass(closeButton, params, 'closeButton');
    	    toggle(closeButton, params.showCloseButton);
    	    closeButton.setAttribute('aria-label', params.closeButtonAriaLabel || '');
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderContainer = (instance, params) => {
    	    const container = getContainer();
    	    if (!container) {
    	      return;
    	    }
    	    handleBackdropParam(container, params.backdrop);
    	    handlePositionParam(container, params.position);
    	    handleGrowParam(container, params.grow);

    	    // Custom class
    	    applyCustomClass(container, params, 'container');
    	  };

    	  /**
    	   * @param {HTMLElement} container
    	   * @param {SweetAlertOptions['backdrop']} backdrop
    	   */
    	  function handleBackdropParam(container, backdrop) {
    	    if (typeof backdrop === 'string') {
    	      container.style.background = backdrop;
    	    } else if (!backdrop) {
    	      addClass([document.documentElement, document.body], swalClasses['no-backdrop']);
    	    }
    	  }

    	  /**
    	   * @param {HTMLElement} container
    	   * @param {SweetAlertOptions['position']} position
    	   */
    	  function handlePositionParam(container, position) {
    	    if (!position) {
    	      return;
    	    }
    	    if (position in swalClasses) {
    	      addClass(container, swalClasses[position]);
    	    } else {
    	      warn('The "position" parameter is not valid, defaulting to "center"');
    	      addClass(container, swalClasses.center);
    	    }
    	  }

    	  /**
    	   * @param {HTMLElement} container
    	   * @param {SweetAlertOptions['grow']} grow
    	   */
    	  function handleGrowParam(container, grow) {
    	    if (!grow) {
    	      return;
    	    }
    	    addClass(container, swalClasses["grow-".concat(grow)]);
    	  }

    	  /**
    	   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
    	   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
    	   * This is the approach that Babel will probably take to implement private methods/fields
    	   *   https://github.com/tc39/proposal-private-methods
    	   *   https://github.com/babel/babel/pull/7555
    	   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
    	   *   then we can use that language feature.
    	   */

    	  var privateProps = {
    	    innerParams: new WeakMap(),
    	    domCache: new WeakMap()
    	  };

    	  /// <reference path="../../../../sweetalert2.d.ts"/>


    	  /** @type {InputClass[]} */
    	  const inputClasses = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderInput = (instance, params) => {
    	    const popup = getPopup();
    	    if (!popup) {
    	      return;
    	    }
    	    const innerParams = privateProps.innerParams.get(instance);
    	    const rerender = !innerParams || params.input !== innerParams.input;
    	    inputClasses.forEach(inputClass => {
    	      const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
    	      if (!inputContainer) {
    	        return;
    	      }

    	      // set attributes
    	      setAttributes(inputClass, params.inputAttributes);

    	      // set class
    	      inputContainer.className = swalClasses[inputClass];
    	      if (rerender) {
    	        hide(inputContainer);
    	      }
    	    });
    	    if (params.input) {
    	      if (rerender) {
    	        showInput(params);
    	      }
    	      // set custom class
    	      setCustomClass(params);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlertOptions} params
    	   */
    	  const showInput = params => {
    	    if (!params.input) {
    	      return;
    	    }
    	    if (!renderInputType[params.input]) {
    	      error("Unexpected type of input! Expected ".concat(Object.keys(renderInputType).join(' | '), ", got \"").concat(params.input, "\""));
    	      return;
    	    }
    	    const inputContainer = getInputContainer(params.input);
    	    const input = renderInputType[params.input](inputContainer, params);
    	    show(inputContainer);

    	    // input autofocus
    	    if (params.inputAutoFocus) {
    	      setTimeout(() => {
    	        focusInput(input);
    	      });
    	    }
    	  };

    	  /**
    	   * @param {HTMLInputElement} input
    	   */
    	  const removeAttributes = input => {
    	    for (let i = 0; i < input.attributes.length; i++) {
    	      const attrName = input.attributes[i].name;
    	      if (!['id', 'type', 'value', 'style'].includes(attrName)) {
    	        input.removeAttribute(attrName);
    	      }
    	    }
    	  };

    	  /**
    	   * @param {InputClass} inputClass
    	   * @param {SweetAlertOptions['inputAttributes']} inputAttributes
    	   */
    	  const setAttributes = (inputClass, inputAttributes) => {
    	    const input = getInput$1(getPopup(), inputClass);
    	    if (!input) {
    	      return;
    	    }
    	    removeAttributes(input);
    	    for (const attr in inputAttributes) {
    	      input.setAttribute(attr, inputAttributes[attr]);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlertOptions} params
    	   */
    	  const setCustomClass = params => {
    	    const inputContainer = getInputContainer(params.input);
    	    if (typeof params.customClass === 'object') {
    	      addClass(inputContainer, params.customClass.input);
    	    }
    	  };

    	  /**
    	   * @param {HTMLInputElement | HTMLTextAreaElement} input
    	   * @param {SweetAlertOptions} params
    	   */
    	  const setInputPlaceholder = (input, params) => {
    	    if (!input.placeholder || params.inputPlaceholder) {
    	      input.placeholder = params.inputPlaceholder;
    	    }
    	  };

    	  /**
    	   * @param {Input} input
    	   * @param {Input} prependTo
    	   * @param {SweetAlertOptions} params
    	   */
    	  const setInputLabel = (input, prependTo, params) => {
    	    if (params.inputLabel) {
    	      const label = document.createElement('label');
    	      const labelClass = swalClasses['input-label'];
    	      label.setAttribute('for', input.id);
    	      label.className = labelClass;
    	      if (typeof params.customClass === 'object') {
    	        addClass(label, params.customClass.inputLabel);
    	      }
    	      label.innerText = params.inputLabel;
    	      prependTo.insertAdjacentElement('beforebegin', label);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlertOptions['input']} inputType
    	   * @returns {HTMLElement}
    	   */
    	  const getInputContainer = inputType => {
    	    return getDirectChildByClass(getPopup(), swalClasses[inputType] || swalClasses.input);
    	  };

    	  /**
    	   * @param {HTMLInputElement | HTMLOutputElement | HTMLTextAreaElement} input
    	   * @param {SweetAlertOptions['inputValue']} inputValue
    	   */
    	  const checkAndSetInputValue = (input, inputValue) => {
    	    if (['string', 'number'].includes(typeof inputValue)) {
    	      input.value = "".concat(inputValue);
    	    } else if (!isPromise(inputValue)) {
    	      warn("Unexpected type of inputValue! Expected \"string\", \"number\" or \"Promise\", got \"".concat(typeof inputValue, "\""));
    	    }
    	  };

    	  /** @type {Record<SweetAlertInput, (input: Input | HTMLElement, params: SweetAlertOptions) => Input>} */
    	  const renderInputType = {};

    	  /**
    	   * @param {HTMLInputElement} input
    	   * @param {SweetAlertOptions} params
    	   * @returns {HTMLInputElement}
    	   */
    	  renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType['datetime-local'] = renderInputType.time = renderInputType.week = renderInputType.month = (input, params) => {
    	    checkAndSetInputValue(input, params.inputValue);
    	    setInputLabel(input, input, params);
    	    setInputPlaceholder(input, params);
    	    input.type = params.input;
    	    return input;
    	  };

    	  /**
    	   * @param {HTMLInputElement} input
    	   * @param {SweetAlertOptions} params
    	   * @returns {HTMLInputElement}
    	   */
    	  renderInputType.file = (input, params) => {
    	    setInputLabel(input, input, params);
    	    setInputPlaceholder(input, params);
    	    return input;
    	  };

    	  /**
    	   * @param {HTMLInputElement} range
    	   * @param {SweetAlertOptions} params
    	   * @returns {HTMLInputElement}
    	   */
    	  renderInputType.range = (range, params) => {
    	    const rangeInput = range.querySelector('input');
    	    const rangeOutput = range.querySelector('output');
    	    checkAndSetInputValue(rangeInput, params.inputValue);
    	    rangeInput.type = params.input;
    	    checkAndSetInputValue(rangeOutput, params.inputValue);
    	    setInputLabel(rangeInput, range, params);
    	    return range;
    	  };

    	  /**
    	   * @param {HTMLSelectElement} select
    	   * @param {SweetAlertOptions} params
    	   * @returns {HTMLSelectElement}
    	   */
    	  renderInputType.select = (select, params) => {
    	    select.textContent = '';
    	    if (params.inputPlaceholder) {
    	      const placeholder = document.createElement('option');
    	      setInnerHtml(placeholder, params.inputPlaceholder);
    	      placeholder.value = '';
    	      placeholder.disabled = true;
    	      placeholder.selected = true;
    	      select.appendChild(placeholder);
    	    }
    	    setInputLabel(select, select, params);
    	    return select;
    	  };

    	  /**
    	   * @param {HTMLInputElement} radio
    	   * @returns {HTMLInputElement}
    	   */
    	  renderInputType.radio = radio => {
    	    radio.textContent = '';
    	    return radio;
    	  };

    	  /**
    	   * @param {HTMLLabelElement} checkboxContainer
    	   * @param {SweetAlertOptions} params
    	   * @returns {HTMLInputElement}
    	   */
    	  renderInputType.checkbox = (checkboxContainer, params) => {
    	    const checkbox = getInput$1(getPopup(), 'checkbox');
    	    checkbox.value = '1';
    	    checkbox.checked = Boolean(params.inputValue);
    	    const label = checkboxContainer.querySelector('span');
    	    setInnerHtml(label, params.inputPlaceholder);
    	    return checkbox;
    	  };

    	  /**
    	   * @param {HTMLTextAreaElement} textarea
    	   * @param {SweetAlertOptions} params
    	   * @returns {HTMLTextAreaElement}
    	   */
    	  renderInputType.textarea = (textarea, params) => {
    	    checkAndSetInputValue(textarea, params.inputValue);
    	    setInputPlaceholder(textarea, params);
    	    setInputLabel(textarea, textarea, params);

    	    /**
    	     * @param {HTMLElement} el
    	     * @returns {number}
    	     */
    	    const getMargin = el => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);

    	    // https://github.com/sweetalert2/sweetalert2/issues/2291
    	    setTimeout(() => {
    	      // https://github.com/sweetalert2/sweetalert2/issues/1699
    	      if ('MutationObserver' in window) {
    	        const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
    	        const textareaResizeHandler = () => {
    	          // check if texarea is still in document (i.e. popup wasn't closed in the meantime)
    	          if (!document.body.contains(textarea)) {
    	            return;
    	          }
    	          const textareaWidth = textarea.offsetWidth + getMargin(textarea);
    	          if (textareaWidth > initialPopupWidth) {
    	            getPopup().style.width = "".concat(textareaWidth, "px");
    	          } else {
    	            applyNumericalStyle(getPopup(), 'width', params.width);
    	          }
    	        };
    	        new MutationObserver(textareaResizeHandler).observe(textarea, {
    	          attributes: true,
    	          attributeFilter: ['style']
    	        });
    	      }
    	    });
    	    return textarea;
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderContent = (instance, params) => {
    	    const htmlContainer = getHtmlContainer();
    	    if (!htmlContainer) {
    	      return;
    	    }
    	    showWhenInnerHtmlPresent(htmlContainer);
    	    applyCustomClass(htmlContainer, params, 'htmlContainer');

    	    // Content as HTML
    	    if (params.html) {
    	      parseHtmlToContainer(params.html, htmlContainer);
    	      show(htmlContainer, 'block');
    	    }

    	    // Content as plain text
    	    else if (params.text) {
    	      htmlContainer.textContent = params.text;
    	      show(htmlContainer, 'block');
    	    }

    	    // No content
    	    else {
    	      hide(htmlContainer);
    	    }
    	    renderInput(instance, params);
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderFooter = (instance, params) => {
    	    const footer = getFooter();
    	    if (!footer) {
    	      return;
    	    }
    	    showWhenInnerHtmlPresent(footer);
    	    toggle(footer, params.footer, 'block');
    	    if (params.footer) {
    	      parseHtmlToContainer(params.footer, footer);
    	    }

    	    // Custom class
    	    applyCustomClass(footer, params, 'footer');
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderIcon = (instance, params) => {
    	    const innerParams = privateProps.innerParams.get(instance);
    	    const icon = getIcon();
    	    if (!icon) {
    	      return;
    	    }

    	    // if the given icon already rendered, apply the styling without re-rendering the icon
    	    if (innerParams && params.icon === innerParams.icon) {
    	      // Custom or default content
    	      setContent(icon, params);
    	      applyStyles(icon, params);
    	      return;
    	    }
    	    if (!params.icon && !params.iconHtml) {
    	      hide(icon);
    	      return;
    	    }
    	    if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
    	      error("Unknown icon! Expected \"success\", \"error\", \"warning\", \"info\" or \"question\", got \"".concat(params.icon, "\""));
    	      hide(icon);
    	      return;
    	    }
    	    show(icon);

    	    // Custom or default content
    	    setContent(icon, params);
    	    applyStyles(icon, params);

    	    // Animate icon
    	    addClass(icon, params.showClass && params.showClass.icon);
    	  };

    	  /**
    	   * @param {HTMLElement} icon
    	   * @param {SweetAlertOptions} params
    	   */
    	  const applyStyles = (icon, params) => {
    	    for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
    	      if (params.icon !== iconType) {
    	        removeClass(icon, iconClassName);
    	      }
    	    }
    	    addClass(icon, params.icon && iconTypes[params.icon]);

    	    // Icon color
    	    setColor(icon, params);

    	    // Success icon background color
    	    adjustSuccessIconBackgroundColor();

    	    // Custom class
    	    applyCustomClass(icon, params, 'icon');
    	  };

    	  // Adjust success icon background color to match the popup background color
    	  const adjustSuccessIconBackgroundColor = () => {
    	    const popup = getPopup();
    	    if (!popup) {
    	      return;
    	    }
    	    const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue('background-color');
    	    /** @type {NodeListOf<HTMLElement>} */
    	    const successIconParts = popup.querySelectorAll('[class^=swal2-success-circular-line], .swal2-success-fix');
    	    for (let i = 0; i < successIconParts.length; i++) {
    	      successIconParts[i].style.backgroundColor = popupBackgroundColor;
    	    }
    	  };
    	  const successIconHtml = "\n  <div class=\"swal2-success-circular-line-left\"></div>\n  <span class=\"swal2-success-line-tip\"></span> <span class=\"swal2-success-line-long\"></span>\n  <div class=\"swal2-success-ring\"></div> <div class=\"swal2-success-fix\"></div>\n  <div class=\"swal2-success-circular-line-right\"></div>\n";
    	  const errorIconHtml = "\n  <span class=\"swal2-x-mark\">\n    <span class=\"swal2-x-mark-line-left\"></span>\n    <span class=\"swal2-x-mark-line-right\"></span>\n  </span>\n";

    	  /**
    	   * @param {HTMLElement} icon
    	   * @param {SweetAlertOptions} params
    	   */
    	  const setContent = (icon, params) => {
    	    if (!params.icon && !params.iconHtml) {
    	      return;
    	    }
    	    let oldContent = icon.innerHTML;
    	    let newContent = '';
    	    if (params.iconHtml) {
    	      newContent = iconContent(params.iconHtml);
    	    } else if (params.icon === 'success') {
    	      newContent = successIconHtml;
    	      oldContent = oldContent.replace(/ style=".*?"/g, ''); // undo adjustSuccessIconBackgroundColor()
    	    } else if (params.icon === 'error') {
    	      newContent = errorIconHtml;
    	    } else if (params.icon) {
    	      const defaultIconHtml = {
    	        question: '?',
    	        warning: '!',
    	        info: 'i'
    	      };
    	      newContent = iconContent(defaultIconHtml[params.icon]);
    	    }
    	    if (oldContent.trim() !== newContent.trim()) {
    	      setInnerHtml(icon, newContent);
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} icon
    	   * @param {SweetAlertOptions} params
    	   */
    	  const setColor = (icon, params) => {
    	    if (!params.iconColor) {
    	      return;
    	    }
    	    icon.style.color = params.iconColor;
    	    icon.style.borderColor = params.iconColor;
    	    for (const sel of ['.swal2-success-line-tip', '.swal2-success-line-long', '.swal2-x-mark-line-left', '.swal2-x-mark-line-right']) {
    	      setStyle(icon, sel, 'backgroundColor', params.iconColor);
    	    }
    	    setStyle(icon, '.swal2-success-ring', 'borderColor', params.iconColor);
    	  };

    	  /**
    	   * @param {string} content
    	   * @returns {string}
    	   */
    	  const iconContent = content => "<div class=\"".concat(swalClasses['icon-content'], "\">").concat(content, "</div>");

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderImage = (instance, params) => {
    	    const image = getImage();
    	    if (!image) {
    	      return;
    	    }
    	    if (!params.imageUrl) {
    	      hide(image);
    	      return;
    	    }
    	    show(image, '');

    	    // Src, alt
    	    image.setAttribute('src', params.imageUrl);
    	    image.setAttribute('alt', params.imageAlt || '');

    	    // Width, height
    	    applyNumericalStyle(image, 'width', params.imageWidth);
    	    applyNumericalStyle(image, 'height', params.imageHeight);

    	    // Class
    	    image.className = swalClasses.image;
    	    applyCustomClass(image, params, 'image');
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderPopup = (instance, params) => {
    	    const container = getContainer();
    	    const popup = getPopup();
    	    if (!container || !popup) {
    	      return;
    	    }

    	    // Width
    	    // https://github.com/sweetalert2/sweetalert2/issues/2170
    	    if (params.toast) {
    	      applyNumericalStyle(container, 'width', params.width);
    	      popup.style.width = '100%';
    	      const loader = getLoader();
    	      loader && popup.insertBefore(loader, getIcon());
    	    } else {
    	      applyNumericalStyle(popup, 'width', params.width);
    	    }

    	    // Padding
    	    applyNumericalStyle(popup, 'padding', params.padding);

    	    // Color
    	    if (params.color) {
    	      popup.style.color = params.color;
    	    }

    	    // Background
    	    if (params.background) {
    	      popup.style.background = params.background;
    	    }
    	    hide(getValidationMessage());

    	    // Classes
    	    addClasses$1(popup, params);
    	  };

    	  /**
    	   * @param {HTMLElement} popup
    	   * @param {SweetAlertOptions} params
    	   */
    	  const addClasses$1 = (popup, params) => {
    	    const showClass = params.showClass || {};
    	    // Default Class + showClass when updating Swal.update({})
    	    popup.className = "".concat(swalClasses.popup, " ").concat(isVisible$1(popup) ? showClass.popup : '');
    	    if (params.toast) {
    	      addClass([document.documentElement, document.body], swalClasses['toast-shown']);
    	      addClass(popup, swalClasses.toast);
    	    } else {
    	      addClass(popup, swalClasses.modal);
    	    }

    	    // Custom class
    	    applyCustomClass(popup, params, 'popup');
    	    if (typeof params.customClass === 'string') {
    	      addClass(popup, params.customClass);
    	    }

    	    // Icon class (#1842)
    	    if (params.icon) {
    	      addClass(popup, swalClasses["icon-".concat(params.icon)]);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderProgressSteps = (instance, params) => {
    	    const progressStepsContainer = getProgressSteps();
    	    if (!progressStepsContainer) {
    	      return;
    	    }
    	    const {
    	      progressSteps,
    	      currentProgressStep
    	    } = params;
    	    if (!progressSteps || progressSteps.length === 0 || currentProgressStep === undefined) {
    	      hide(progressStepsContainer);
    	      return;
    	    }
    	    show(progressStepsContainer);
    	    progressStepsContainer.textContent = '';
    	    if (currentProgressStep >= progressSteps.length) {
    	      warn('Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    	    }
    	    progressSteps.forEach((step, index) => {
    	      const stepEl = createStepElement(step);
    	      progressStepsContainer.appendChild(stepEl);
    	      if (index === currentProgressStep) {
    	        addClass(stepEl, swalClasses['active-progress-step']);
    	      }
    	      if (index !== progressSteps.length - 1) {
    	        const lineEl = createLineElement(params);
    	        progressStepsContainer.appendChild(lineEl);
    	      }
    	    });
    	  };

    	  /**
    	   * @param {string} step
    	   * @returns {HTMLLIElement}
    	   */
    	  const createStepElement = step => {
    	    const stepEl = document.createElement('li');
    	    addClass(stepEl, swalClasses['progress-step']);
    	    setInnerHtml(stepEl, step);
    	    return stepEl;
    	  };

    	  /**
    	   * @param {SweetAlertOptions} params
    	   * @returns {HTMLLIElement}
    	   */
    	  const createLineElement = params => {
    	    const lineEl = document.createElement('li');
    	    addClass(lineEl, swalClasses['progress-step-line']);
    	    if (params.progressStepsDistance) {
    	      applyNumericalStyle(lineEl, 'width', params.progressStepsDistance);
    	    }
    	    return lineEl;
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const renderTitle = (instance, params) => {
    	    const title = getTitle();
    	    if (!title) {
    	      return;
    	    }
    	    showWhenInnerHtmlPresent(title);
    	    toggle(title, params.title || params.titleText, 'block');
    	    if (params.title) {
    	      parseHtmlToContainer(params.title, title);
    	    }
    	    if (params.titleText) {
    	      title.innerText = params.titleText;
    	    }

    	    // Custom class
    	    applyCustomClass(title, params, 'title');
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const render = (instance, params) => {
    	    renderPopup(instance, params);
    	    renderContainer(instance, params);
    	    renderProgressSteps(instance, params);
    	    renderIcon(instance, params);
    	    renderImage(instance, params);
    	    renderTitle(instance, params);
    	    renderCloseButton(instance, params);
    	    renderContent(instance, params);
    	    renderActions(instance, params);
    	    renderFooter(instance, params);
    	    const popup = getPopup();
    	    if (typeof params.didRender === 'function' && popup) {
    	      params.didRender(popup);
    	    }
    	  };

    	  /*
    	   * Global function to determine if SweetAlert2 popup is shown
    	   */
    	  const isVisible = () => {
    	    return isVisible$1(getPopup());
    	  };

    	  /*
    	   * Global function to click 'Confirm' button
    	   */
    	  const clickConfirm = () => {
    	    var _dom$getConfirmButton;
    	    return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
    	  };

    	  /*
    	   * Global function to click 'Deny' button
    	   */
    	  const clickDeny = () => {
    	    var _dom$getDenyButton;
    	    return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
    	  };

    	  /*
    	   * Global function to click 'Cancel' button
    	   */
    	  const clickCancel = () => {
    	    var _dom$getCancelButton;
    	    return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
    	  };

    	  /** @typedef {'cancel' | 'backdrop' | 'close' | 'esc' | 'timer'} DismissReason */

    	  /** @type {Record<DismissReason, DismissReason>} */
    	  const DismissReason = Object.freeze({
    	    cancel: 'cancel',
    	    backdrop: 'backdrop',
    	    close: 'close',
    	    esc: 'esc',
    	    timer: 'timer'
    	  });

    	  /**
    	   * @param {GlobalState} globalState
    	   */
    	  const removeKeydownHandler = globalState => {
    	    if (globalState.keydownTarget && globalState.keydownHandlerAdded) {
    	      globalState.keydownTarget.removeEventListener('keydown', globalState.keydownHandler, {
    	        capture: globalState.keydownListenerCapture
    	      });
    	      globalState.keydownHandlerAdded = false;
    	    }
    	  };

    	  /**
    	   * @param {GlobalState} globalState
    	   * @param {SweetAlertOptions} innerParams
    	   * @param {*} dismissWith
    	   */
    	  const addKeydownHandler = (globalState, innerParams, dismissWith) => {
    	    removeKeydownHandler(globalState);
    	    if (!innerParams.toast) {
    	      globalState.keydownHandler = e => keydownHandler(innerParams, e, dismissWith);
    	      globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
    	      globalState.keydownListenerCapture = innerParams.keydownListenerCapture;
    	      globalState.keydownTarget.addEventListener('keydown', globalState.keydownHandler, {
    	        capture: globalState.keydownListenerCapture
    	      });
    	      globalState.keydownHandlerAdded = true;
    	    }
    	  };

    	  /**
    	   * @param {number} index
    	   * @param {number} increment
    	   */
    	  const setFocus = (index, increment) => {
    	    var _dom$getPopup;
    	    const focusableElements = getFocusableElements();
    	    // search for visible elements and select the next possible match
    	    if (focusableElements.length) {
    	      index = index + increment;

    	      // rollover to first item
    	      if (index === focusableElements.length) {
    	        index = 0;

    	        // go to last item
    	      } else if (index === -1) {
    	        index = focusableElements.length - 1;
    	      }
    	      focusableElements[index].focus();
    	      return;
    	    }
    	    // no visible focusable elements, focus the popup
    	    (_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
    	  };
    	  const arrowKeysNextButton = ['ArrowRight', 'ArrowDown'];
    	  const arrowKeysPreviousButton = ['ArrowLeft', 'ArrowUp'];

    	  /**
    	   * @param {SweetAlertOptions} innerParams
    	   * @param {KeyboardEvent} event
    	   * @param {Function} dismissWith
    	   */
    	  const keydownHandler = (innerParams, event, dismissWith) => {
    	    if (!innerParams) {
    	      return; // This instance has already been destroyed
    	    }

    	    // Ignore keydown during IME composition
    	    // https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event#ignoring_keydown_during_ime_composition
    	    // https://github.com/sweetalert2/sweetalert2/issues/720
    	    // https://github.com/sweetalert2/sweetalert2/issues/2406
    	    if (event.isComposing || event.keyCode === 229) {
    	      return;
    	    }
    	    if (innerParams.stopKeydownPropagation) {
    	      event.stopPropagation();
    	    }

    	    // ENTER
    	    if (event.key === 'Enter') {
    	      handleEnter(event, innerParams);
    	    }

    	    // TAB
    	    else if (event.key === 'Tab') {
    	      handleTab(event);
    	    }

    	    // ARROWS - switch focus between buttons
    	    else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
    	      handleArrows(event.key);
    	    }

    	    // ESC
    	    else if (event.key === 'Escape') {
    	      handleEsc(event, innerParams, dismissWith);
    	    }
    	  };

    	  /**
    	   * @param {KeyboardEvent} event
    	   * @param {SweetAlertOptions} innerParams
    	   */
    	  const handleEnter = (event, innerParams) => {
    	    // https://github.com/sweetalert2/sweetalert2/issues/2386
    	    if (!callIfFunction(innerParams.allowEnterKey)) {
    	      return;
    	    }
    	    const input = getInput$1(getPopup(), innerParams.input);
    	    if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
    	      if (['textarea', 'file'].includes(innerParams.input)) {
    	        return; // do not submit
    	      }

    	      clickConfirm();
    	      event.preventDefault();
    	    }
    	  };

    	  /**
    	   * @param {KeyboardEvent} event
    	   */
    	  const handleTab = event => {
    	    const targetElement = event.target;
    	    const focusableElements = getFocusableElements();
    	    let btnIndex = -1;
    	    for (let i = 0; i < focusableElements.length; i++) {
    	      if (targetElement === focusableElements[i]) {
    	        btnIndex = i;
    	        break;
    	      }
    	    }

    	    // Cycle to the next button
    	    if (!event.shiftKey) {
    	      setFocus(btnIndex, 1);
    	    }

    	    // Cycle to the prev button
    	    else {
    	      setFocus(btnIndex, -1);
    	    }
    	    event.stopPropagation();
    	    event.preventDefault();
    	  };

    	  /**
    	   * @param {string} key
    	   */
    	  const handleArrows = key => {
    	    const actions = getActions();
    	    const confirmButton = getConfirmButton();
    	    const denyButton = getDenyButton();
    	    const cancelButton = getCancelButton();
    	    if (!actions || !confirmButton || !denyButton || !cancelButton) {
    	      return;
    	    }
    	    /** @type HTMLElement[] */
    	    const buttons = [confirmButton, denyButton, cancelButton];
    	    if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
    	      return;
    	    }
    	    const sibling = arrowKeysNextButton.includes(key) ? 'nextElementSibling' : 'previousElementSibling';
    	    let buttonToFocus = document.activeElement;
    	    if (!buttonToFocus) {
    	      return;
    	    }
    	    for (let i = 0; i < actions.children.length; i++) {
    	      buttonToFocus = buttonToFocus[sibling];
    	      if (!buttonToFocus) {
    	        return;
    	      }
    	      if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
    	        break;
    	      }
    	    }
    	    if (buttonToFocus instanceof HTMLButtonElement) {
    	      buttonToFocus.focus();
    	    }
    	  };

    	  /**
    	   * @param {KeyboardEvent} event
    	   * @param {SweetAlertOptions} innerParams
    	   * @param {Function} dismissWith
    	   */
    	  const handleEsc = (event, innerParams, dismissWith) => {
    	    if (callIfFunction(innerParams.allowEscapeKey)) {
    	      event.preventDefault();
    	      dismissWith(DismissReason.esc);
    	    }
    	  };

    	  /**
    	   * This module contains `WeakMap`s for each effectively-"private  property" that a `Swal` has.
    	   * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
    	   * This is the approach that Babel will probably take to implement private methods/fields
    	   *   https://github.com/tc39/proposal-private-methods
    	   *   https://github.com/babel/babel/pull/7555
    	   * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
    	   *   then we can use that language feature.
    	   */

    	  var privateMethods = {
    	    swalPromiseResolve: new WeakMap(),
    	    swalPromiseReject: new WeakMap()
    	  };

    	  // From https://developer.paciellogroup.com/blog/2018/06/the-current-state-of-modal-dialog-accessibility/
    	  // Adding aria-hidden="true" to elements outside of the active modal dialog ensures that
    	  // elements not within the active modal dialog will not be surfaced if a user opens a screen
    	  // reader’s list of elements (headings, form controls, landmarks, etc.) in the document.

    	  const setAriaHidden = () => {
    	    const bodyChildren = Array.from(document.body.children);
    	    bodyChildren.forEach(el => {
    	      if (el === getContainer() || el.contains(getContainer())) {
    	        return;
    	      }
    	      if (el.hasAttribute('aria-hidden')) {
    	        el.setAttribute('data-previous-aria-hidden', el.getAttribute('aria-hidden') || '');
    	      }
    	      el.setAttribute('aria-hidden', 'true');
    	    });
    	  };
    	  const unsetAriaHidden = () => {
    	    const bodyChildren = Array.from(document.body.children);
    	    bodyChildren.forEach(el => {
    	      if (el.hasAttribute('data-previous-aria-hidden')) {
    	        el.setAttribute('aria-hidden', el.getAttribute('data-previous-aria-hidden') || '');
    	        el.removeAttribute('data-previous-aria-hidden');
    	      } else {
    	        el.removeAttribute('aria-hidden');
    	      }
    	    });
    	  };

    	  // @ts-ignore
    	  const isSafariOrIOS = typeof window !== 'undefined' && !!window.GestureEvent; // true for Safari desktop + all iOS browsers https://stackoverflow.com/a/70585394

    	  /**
    	   * Fix iOS scrolling
    	   * http://stackoverflow.com/q/39626302
    	   */
    	  const iOSfix = () => {
    	    if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
    	      const offset = document.body.scrollTop;
    	      document.body.style.top = "".concat(offset * -1, "px");
    	      addClass(document.body, swalClasses.iosfix);
    	      lockBodyScroll();
    	    }
    	  };

    	  /**
    	   * https://github.com/sweetalert2/sweetalert2/issues/1246
    	   */
    	  const lockBodyScroll = () => {
    	    const container = getContainer();
    	    if (!container) {
    	      return;
    	    }
    	    /** @type {boolean} */
    	    let preventTouchMove;
    	    /**
    	     * @param {TouchEvent} event
    	     */
    	    container.ontouchstart = event => {
    	      preventTouchMove = shouldPreventTouchMove(event);
    	    };
    	    /**
    	     * @param {TouchEvent} event
    	     */
    	    container.ontouchmove = event => {
    	      if (preventTouchMove) {
    	        event.preventDefault();
    	        event.stopPropagation();
    	      }
    	    };
    	  };

    	  /**
    	   * @param {TouchEvent} event
    	   * @returns {boolean}
    	   */
    	  const shouldPreventTouchMove = event => {
    	    const target = event.target;
    	    const container = getContainer();
    	    const htmlContainer = getHtmlContainer();
    	    if (!container || !htmlContainer) {
    	      return false;
    	    }
    	    if (isStylus(event) || isZoom(event)) {
    	      return false;
    	    }
    	    if (target === container) {
    	      return true;
    	    }
    	    if (!isScrollable(container) && target instanceof HTMLElement && target.tagName !== 'INPUT' &&
    	    // #1603
    	    target.tagName !== 'TEXTAREA' &&
    	    // #2266
    	    !(isScrollable(htmlContainer) &&
    	    // #1944
    	    htmlContainer.contains(target))) {
    	      return true;
    	    }
    	    return false;
    	  };

    	  /**
    	   * https://github.com/sweetalert2/sweetalert2/issues/1786
    	   *
    	   * @param {*} event
    	   * @returns {boolean}
    	   */
    	  const isStylus = event => {
    	    return event.touches && event.touches.length && event.touches[0].touchType === 'stylus';
    	  };

    	  /**
    	   * https://github.com/sweetalert2/sweetalert2/issues/1891
    	   *
    	   * @param {TouchEvent} event
    	   * @returns {boolean}
    	   */
    	  const isZoom = event => {
    	    return event.touches && event.touches.length > 1;
    	  };
    	  const undoIOSfix = () => {
    	    if (hasClass(document.body, swalClasses.iosfix)) {
    	      const offset = parseInt(document.body.style.top, 10);
    	      removeClass(document.body, swalClasses.iosfix);
    	      document.body.style.top = '';
    	      document.body.scrollTop = offset * -1;
    	    }
    	  };

    	  /**
    	   * Measure scrollbar width for padding body during modal show/hide
    	   * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
    	   *
    	   * @returns {number}
    	   */
    	  const measureScrollbar = () => {
    	    const scrollDiv = document.createElement('div');
    	    scrollDiv.className = swalClasses['scrollbar-measure'];
    	    document.body.appendChild(scrollDiv);
    	    const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    	    document.body.removeChild(scrollDiv);
    	    return scrollbarWidth;
    	  };

    	  /**
    	   * Remember state in cases where opening and handling a modal will fiddle with it.
    	   * @type {number | null}
    	   */
    	  let previousBodyPadding = null;

    	  /**
    	   * @param {string} initialBodyOverflow
    	   */
    	  const replaceScrollbarWithPadding = initialBodyOverflow => {
    	    // for queues, do not do this more than once
    	    if (previousBodyPadding !== null) {
    	      return;
    	    }
    	    // if the body has overflow
    	    if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === 'scroll' // https://github.com/sweetalert2/sweetalert2/issues/2663
    	    ) {
    	      // add padding so the content doesn't shift after removal of scrollbar
    	      previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'));
    	      document.body.style.paddingRight = "".concat(previousBodyPadding + measureScrollbar(), "px");
    	    }
    	  };
    	  const undoReplaceScrollbarWithPadding = () => {
    	    if (previousBodyPadding !== null) {
    	      document.body.style.paddingRight = "".concat(previousBodyPadding, "px");
    	      previousBodyPadding = null;
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {HTMLElement} container
    	   * @param {boolean} returnFocus
    	   * @param {Function} didClose
    	   */
    	  function removePopupAndResetState(instance, container, returnFocus, didClose) {
    	    if (isToast()) {
    	      triggerDidCloseAndDispose(instance, didClose);
    	    } else {
    	      restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
    	      removeKeydownHandler(globalState);
    	    }

    	    // workaround for https://github.com/sweetalert2/sweetalert2/issues/2088
    	    // for some reason removing the container in Safari will scroll the document to bottom
    	    if (isSafariOrIOS) {
    	      container.setAttribute('style', 'display:none !important');
    	      container.removeAttribute('class');
    	      container.innerHTML = '';
    	    } else {
    	      container.remove();
    	    }
    	    if (isModal()) {
    	      undoReplaceScrollbarWithPadding();
    	      undoIOSfix();
    	      unsetAriaHidden();
    	    }
    	    removeBodyClasses();
    	  }

    	  /**
    	   * Remove SweetAlert2 classes from body
    	   */
    	  function removeBodyClasses() {
    	    removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses['height-auto'], swalClasses['no-backdrop'], swalClasses['toast-shown']]);
    	  }

    	  /**
    	   * Instance method to close sweetAlert
    	   *
    	   * @param {any} resolveValue
    	   */
    	  function close(resolveValue) {
    	    resolveValue = prepareResolveValue(resolveValue);
    	    const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
    	    const didClose = triggerClosePopup(this);
    	    if (this.isAwaitingPromise) {
    	      // A swal awaiting for a promise (after a click on Confirm or Deny) cannot be dismissed anymore #2335
    	      if (!resolveValue.isDismissed) {
    	        handleAwaitingPromise(this);
    	        swalPromiseResolve(resolveValue);
    	      }
    	    } else if (didClose) {
    	      // Resolve Swal promise
    	      swalPromiseResolve(resolveValue);
    	    }
    	  }
    	  const triggerClosePopup = instance => {
    	    const popup = getPopup();
    	    if (!popup) {
    	      return false;
    	    }
    	    const innerParams = privateProps.innerParams.get(instance);
    	    if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
    	      return false;
    	    }
    	    removeClass(popup, innerParams.showClass.popup);
    	    addClass(popup, innerParams.hideClass.popup);
    	    const backdrop = getContainer();
    	    removeClass(backdrop, innerParams.showClass.backdrop);
    	    addClass(backdrop, innerParams.hideClass.backdrop);
    	    handlePopupAnimation(instance, popup, innerParams);
    	    return true;
    	  };

    	  /**
    	   * @param {any} error
    	   */
    	  function rejectPromise(error) {
    	    const rejectPromise = privateMethods.swalPromiseReject.get(this);
    	    handleAwaitingPromise(this);
    	    if (rejectPromise) {
    	      // Reject Swal promise
    	      rejectPromise(error);
    	    }
    	  }

    	  /**
    	   * @param {SweetAlert} instance
    	   */
    	  const handleAwaitingPromise = instance => {
    	    if (instance.isAwaitingPromise) {
    	      delete instance.isAwaitingPromise;
    	      // The instance might have been previously partly destroyed, we must resume the destroy process in this case #2335
    	      if (!privateProps.innerParams.get(instance)) {
    	        instance._destroy();
    	      }
    	    }
    	  };

    	  /**
    	   * @param {any} resolveValue
    	   * @returns {SweetAlertResult}
    	   */
    	  const prepareResolveValue = resolveValue => {
    	    // When user calls Swal.close()
    	    if (typeof resolveValue === 'undefined') {
    	      return {
    	        isConfirmed: false,
    	        isDenied: false,
    	        isDismissed: true
    	      };
    	    }
    	    return Object.assign({
    	      isConfirmed: false,
    	      isDenied: false,
    	      isDismissed: false
    	    }, resolveValue);
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {HTMLElement} popup
    	   * @param {SweetAlertOptions} innerParams
    	   */
    	  const handlePopupAnimation = (instance, popup, innerParams) => {
    	    const container = getContainer();
    	    // If animation is supported, animate
    	    const animationIsSupported = animationEndEvent && hasCssAnimation(popup);
    	    if (typeof innerParams.willClose === 'function') {
    	      innerParams.willClose(popup);
    	    }
    	    if (animationIsSupported) {
    	      animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
    	    } else {
    	      // Otherwise, remove immediately
    	      removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {HTMLElement} popup
    	   * @param {HTMLElement} container
    	   * @param {boolean} returnFocus
    	   * @param {Function} didClose
    	   */
    	  const animatePopup = (instance, popup, container, returnFocus, didClose) => {
    	    if (!animationEndEvent) {
    	      return;
    	    }
    	    globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
    	    popup.addEventListener(animationEndEvent, function (e) {
    	      if (e.target === popup) {
    	        globalState.swalCloseEventFinishedCallback();
    	        delete globalState.swalCloseEventFinishedCallback;
    	      }
    	    });
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {Function} didClose
    	   */
    	  const triggerDidCloseAndDispose = (instance, didClose) => {
    	    setTimeout(() => {
    	      if (typeof didClose === 'function') {
    	        didClose.bind(instance.params)();
    	      }
    	      // instance might have been destroyed already
    	      if (instance._destroy) {
    	        instance._destroy();
    	      }
    	    });
    	  };

    	  /**
    	   * Shows loader (spinner), this is useful with AJAX requests.
    	   * By default the loader be shown instead of the "Confirm" button.
    	   *
    	   * @param {HTMLButtonElement | null} [buttonToReplace]
    	   */
    	  const showLoading = buttonToReplace => {
    	    let popup = getPopup();
    	    if (!popup) {
    	      new Swal(); // eslint-disable-line no-new
    	    }

    	    popup = getPopup();
    	    if (!popup) {
    	      return;
    	    }
    	    const loader = getLoader();
    	    if (isToast()) {
    	      hide(getIcon());
    	    } else {
    	      replaceButton(popup, buttonToReplace);
    	    }
    	    show(loader);
    	    popup.setAttribute('data-loading', 'true');
    	    popup.setAttribute('aria-busy', 'true');
    	    popup.focus();
    	  };

    	  /**
    	   * @param {HTMLElement} popup
    	   * @param {HTMLButtonElement | null} [buttonToReplace]
    	   */
    	  const replaceButton = (popup, buttonToReplace) => {
    	    const actions = getActions();
    	    const loader = getLoader();
    	    if (!actions || !loader) {
    	      return;
    	    }
    	    if (!buttonToReplace && isVisible$1(getConfirmButton())) {
    	      buttonToReplace = getConfirmButton();
    	    }
    	    show(actions);
    	    if (buttonToReplace) {
    	      hide(buttonToReplace);
    	      loader.setAttribute('data-button-to-replace', buttonToReplace.className);
    	      actions.insertBefore(loader, buttonToReplace);
    	    }
    	    addClass([popup, actions], swalClasses.loading);
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const handleInputOptionsAndValue = (instance, params) => {
    	    if (params.input === 'select' || params.input === 'radio') {
    	      handleInputOptions(instance, params);
    	    } else if (['text', 'email', 'number', 'tel', 'textarea'].some(i => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue))) {
    	      showLoading(getConfirmButton());
    	      handleInputValue(instance, params);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} innerParams
    	   * @returns {SweetAlertInputValue}
    	   */
    	  const getInputValue = (instance, innerParams) => {
    	    const input = instance.getInput();
    	    if (!input) {
    	      return null;
    	    }
    	    switch (innerParams.input) {
    	      case 'checkbox':
    	        return getCheckboxValue(input);
    	      case 'radio':
    	        return getRadioValue(input);
    	      case 'file':
    	        return getFileValue(input);
    	      default:
    	        return innerParams.inputAutoTrim ? input.value.trim() : input.value;
    	    }
    	  };

    	  /**
    	   * @param {HTMLInputElement} input
    	   * @returns {number}
    	   */
    	  const getCheckboxValue = input => input.checked ? 1 : 0;

    	  /**
    	   * @param {HTMLInputElement} input
    	   * @returns {string | null}
    	   */
    	  const getRadioValue = input => input.checked ? input.value : null;

    	  /**
    	   * @param {HTMLInputElement} input
    	   * @returns {FileList | File | null}
    	   */
    	  const getFileValue = input => input.files && input.files.length ? input.getAttribute('multiple') !== null ? input.files : input.files[0] : null;

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const handleInputOptions = (instance, params) => {
    	    const popup = getPopup();
    	    if (!popup) {
    	      return;
    	    }
    	    /**
    	     * @param {Record<string, any>} inputOptions
    	     */
    	    const processInputOptions = inputOptions => {
    	      if (params.input === 'select') {
    	        populateSelectOptions(popup, formatInputOptions(inputOptions), params);
    	      } else if (params.input === 'radio') {
    	        populateRadioOptions(popup, formatInputOptions(inputOptions), params);
    	      }
    	    };
    	    if (hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions)) {
    	      showLoading(getConfirmButton());
    	      asPromise(params.inputOptions).then(inputOptions => {
    	        instance.hideLoading();
    	        processInputOptions(inputOptions);
    	      });
    	    } else if (typeof params.inputOptions === 'object') {
    	      processInputOptions(params.inputOptions);
    	    } else {
    	      error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(typeof params.inputOptions));
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertOptions} params
    	   */
    	  const handleInputValue = (instance, params) => {
    	    const input = instance.getInput();
    	    if (!input) {
    	      return;
    	    }
    	    hide(input);
    	    asPromise(params.inputValue).then(inputValue => {
    	      input.value = params.input === 'number' ? "".concat(parseFloat(inputValue) || 0) : "".concat(inputValue);
    	      show(input);
    	      input.focus();
    	      instance.hideLoading();
    	    }).catch(err => {
    	      error("Error in inputValue promise: ".concat(err));
    	      input.value = '';
    	      show(input);
    	      input.focus();
    	      instance.hideLoading();
    	    });
    	  };

    	  /**
    	   * @param {HTMLElement} popup
    	   * @param {InputOptionFlattened[]} inputOptions
    	   * @param {SweetAlertOptions} params
    	   */
    	  function populateSelectOptions(popup, inputOptions, params) {
    	    const select = getDirectChildByClass(popup, swalClasses.select);
    	    if (!select) {
    	      return;
    	    }
    	    /**
    	     * @param {HTMLElement} parent
    	     * @param {string} optionLabel
    	     * @param {string} optionValue
    	     */
    	    const renderOption = (parent, optionLabel, optionValue) => {
    	      const option = document.createElement('option');
    	      option.value = optionValue;
    	      setInnerHtml(option, optionLabel);
    	      option.selected = isSelected(optionValue, params.inputValue);
    	      parent.appendChild(option);
    	    };
    	    inputOptions.forEach(inputOption => {
    	      const optionValue = inputOption[0];
    	      const optionLabel = inputOption[1];
    	      // <optgroup> spec:
    	      // https://www.w3.org/TR/html401/interact/forms.html#h-17.6
    	      // "...all OPTGROUP elements must be specified directly within a SELECT element (i.e., groups may not be nested)..."
    	      // check whether this is a <optgroup>
    	      if (Array.isArray(optionLabel)) {
    	        // if it is an array, then it is an <optgroup>
    	        const optgroup = document.createElement('optgroup');
    	        optgroup.label = optionValue;
    	        optgroup.disabled = false; // not configurable for now
    	        select.appendChild(optgroup);
    	        optionLabel.forEach(o => renderOption(optgroup, o[1], o[0]));
    	      } else {
    	        // case of <option>
    	        renderOption(select, optionLabel, optionValue);
    	      }
    	    });
    	    select.focus();
    	  }

    	  /**
    	   * @param {HTMLElement} popup
    	   * @param {InputOptionFlattened[]} inputOptions
    	   * @param {SweetAlertOptions} params
    	   */
    	  function populateRadioOptions(popup, inputOptions, params) {
    	    const radio = getDirectChildByClass(popup, swalClasses.radio);
    	    if (!radio) {
    	      return;
    	    }
    	    inputOptions.forEach(inputOption => {
    	      const radioValue = inputOption[0];
    	      const radioLabel = inputOption[1];
    	      const radioInput = document.createElement('input');
    	      const radioLabelElement = document.createElement('label');
    	      radioInput.type = 'radio';
    	      radioInput.name = swalClasses.radio;
    	      radioInput.value = radioValue;
    	      if (isSelected(radioValue, params.inputValue)) {
    	        radioInput.checked = true;
    	      }
    	      const label = document.createElement('span');
    	      setInnerHtml(label, radioLabel);
    	      label.className = swalClasses.label;
    	      radioLabelElement.appendChild(radioInput);
    	      radioLabelElement.appendChild(label);
    	      radio.appendChild(radioLabelElement);
    	    });
    	    const radios = radio.querySelectorAll('input');
    	    if (radios.length) {
    	      radios[0].focus();
    	    }
    	  }

    	  /**
    	   * Converts `inputOptions` into an array of `[value, label]`s
    	   *
    	   * @param {Record<string, any>} inputOptions
    	   * @typedef {string[]} InputOptionFlattened
    	   * @returns {InputOptionFlattened[]}
    	   */
    	  const formatInputOptions = inputOptions => {
    	    /** @type {InputOptionFlattened[]} */
    	    const result = [];
    	    if (inputOptions instanceof Map) {
    	      inputOptions.forEach((value, key) => {
    	        let valueFormatted = value;
    	        if (typeof valueFormatted === 'object') {
    	          // case of <optgroup>
    	          valueFormatted = formatInputOptions(valueFormatted);
    	        }
    	        result.push([key, valueFormatted]);
    	      });
    	    } else {
    	      Object.keys(inputOptions).forEach(key => {
    	        let valueFormatted = inputOptions[key];
    	        if (typeof valueFormatted === 'object') {
    	          // case of <optgroup>
    	          valueFormatted = formatInputOptions(valueFormatted);
    	        }
    	        result.push([key, valueFormatted]);
    	      });
    	    }
    	    return result;
    	  };

    	  /**
    	   * @param {string} optionValue
    	   * @param {SweetAlertInputValue} inputValue
    	   * @returns {boolean}
    	   */
    	  const isSelected = (optionValue, inputValue) => {
    	    return !!inputValue && inputValue.toString() === optionValue.toString();
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   */
    	  const handleConfirmButtonClick = instance => {
    	    const innerParams = privateProps.innerParams.get(instance);
    	    instance.disableButtons();
    	    if (innerParams.input) {
    	      handleConfirmOrDenyWithInput(instance, 'confirm');
    	    } else {
    	      confirm(instance, true);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   */
    	  const handleDenyButtonClick = instance => {
    	    const innerParams = privateProps.innerParams.get(instance);
    	    instance.disableButtons();
    	    if (innerParams.returnInputValueOnDeny) {
    	      handleConfirmOrDenyWithInput(instance, 'deny');
    	    } else {
    	      deny(instance, false);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {Function} dismissWith
    	   */
    	  const handleCancelButtonClick = (instance, dismissWith) => {
    	    instance.disableButtons();
    	    dismissWith(DismissReason.cancel);
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {'confirm' | 'deny'} type
    	   */
    	  const handleConfirmOrDenyWithInput = (instance, type) => {
    	    const innerParams = privateProps.innerParams.get(instance);
    	    if (!innerParams.input) {
    	      error("The \"input\" parameter is needed to be set when using returnInputValueOn".concat(capitalizeFirstLetter(type)));
    	      return;
    	    }
    	    const input = instance.getInput();
    	    const inputValue = getInputValue(instance, innerParams);
    	    if (innerParams.inputValidator) {
    	      handleInputValidator(instance, inputValue, type);
    	    } else if (input && !input.checkValidity()) {
    	      instance.enableButtons();
    	      instance.showValidationMessage(innerParams.validationMessage);
    	    } else if (type === 'deny') {
    	      deny(instance, inputValue);
    	    } else {
    	      confirm(instance, inputValue);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {SweetAlertInputValue} inputValue
    	   * @param {'confirm' | 'deny'} type
    	   */
    	  const handleInputValidator = (instance, inputValue, type) => {
    	    const innerParams = privateProps.innerParams.get(instance);
    	    instance.disableInput();
    	    const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
    	    validationPromise.then(validationMessage => {
    	      instance.enableButtons();
    	      instance.enableInput();
    	      if (validationMessage) {
    	        instance.showValidationMessage(validationMessage);
    	      } else if (type === 'deny') {
    	        deny(instance, inputValue);
    	      } else {
    	        confirm(instance, inputValue);
    	      }
    	    });
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {any} value
    	   */
    	  const deny = (instance, value) => {
    	    const innerParams = privateProps.innerParams.get(instance || undefined);
    	    if (innerParams.showLoaderOnDeny) {
    	      showLoading(getDenyButton());
    	    }
    	    if (innerParams.preDeny) {
    	      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preDeny's promise is received
    	      const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
    	      preDenyPromise.then(preDenyValue => {
    	        if (preDenyValue === false) {
    	          instance.hideLoading();
    	          handleAwaitingPromise(instance);
    	        } else {
    	          instance.close({
    	            isDenied: true,
    	            value: typeof preDenyValue === 'undefined' ? value : preDenyValue
    	          });
    	        }
    	      }).catch(error => rejectWith(instance || undefined, error));
    	    } else {
    	      instance.close({
    	        isDenied: true,
    	        value
    	      });
    	    }
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {any} value
    	   */
    	  const succeedWith = (instance, value) => {
    	    instance.close({
    	      isConfirmed: true,
    	      value
    	    });
    	  };

    	  /**
    	   *
    	   * @param {SweetAlert} instance
    	   * @param {string} error
    	   */
    	  const rejectWith = (instance, error) => {
    	    instance.rejectPromise(error);
    	  };

    	  /**
    	   *
    	   * @param {SweetAlert} instance
    	   * @param {any} value
    	   */
    	  const confirm = (instance, value) => {
    	    const innerParams = privateProps.innerParams.get(instance || undefined);
    	    if (innerParams.showLoaderOnConfirm) {
    	      showLoading();
    	    }
    	    if (innerParams.preConfirm) {
    	      instance.resetValidationMessage();
    	      instance.isAwaitingPromise = true; // Flagging the instance as awaiting a promise so it's own promise's reject/resolve methods doesn't get destroyed until the result from this preConfirm's promise is received
    	      const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
    	      preConfirmPromise.then(preConfirmValue => {
    	        if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
    	          instance.hideLoading();
    	          handleAwaitingPromise(instance);
    	        } else {
    	          succeedWith(instance, typeof preConfirmValue === 'undefined' ? value : preConfirmValue);
    	        }
    	      }).catch(error => rejectWith(instance || undefined, error));
    	    } else {
    	      succeedWith(instance, value);
    	    }
    	  };

    	  /**
    	   * Hides loader and shows back the button which was hidden by .showLoading()
    	   */
    	  function hideLoading() {
    	    // do nothing if popup is closed
    	    const innerParams = privateProps.innerParams.get(this);
    	    if (!innerParams) {
    	      return;
    	    }
    	    const domCache = privateProps.domCache.get(this);
    	    hide(domCache.loader);
    	    if (isToast()) {
    	      if (innerParams.icon) {
    	        show(getIcon());
    	      }
    	    } else {
    	      showRelatedButton(domCache);
    	    }
    	    removeClass([domCache.popup, domCache.actions], swalClasses.loading);
    	    domCache.popup.removeAttribute('aria-busy');
    	    domCache.popup.removeAttribute('data-loading');
    	    domCache.confirmButton.disabled = false;
    	    domCache.denyButton.disabled = false;
    	    domCache.cancelButton.disabled = false;
    	  }
    	  const showRelatedButton = domCache => {
    	    const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute('data-button-to-replace'));
    	    if (buttonToReplace.length) {
    	      show(buttonToReplace[0], 'inline-block');
    	    } else if (allButtonsAreHidden()) {
    	      hide(domCache.actions);
    	    }
    	  };

    	  /**
    	   * Gets the input DOM node, this method works with input parameter.
    	   *
    	   * @returns {HTMLInputElement | null}
    	   */
    	  function getInput() {
    	    const innerParams = privateProps.innerParams.get(this);
    	    const domCache = privateProps.domCache.get(this);
    	    if (!domCache) {
    	      return null;
    	    }
    	    return getInput$1(domCache.popup, innerParams.input);
    	  }

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {string[]} buttons
    	   * @param {boolean} disabled
    	   */
    	  function setButtonsDisabled(instance, buttons, disabled) {
    	    const domCache = privateProps.domCache.get(instance);
    	    buttons.forEach(button => {
    	      domCache[button].disabled = disabled;
    	    });
    	  }

    	  /**
    	   * @param {HTMLInputElement | null} input
    	   * @param {boolean} disabled
    	   */
    	  function setInputDisabled(input, disabled) {
    	    const popup = getPopup();
    	    if (!popup || !input) {
    	      return;
    	    }
    	    if (input.type === 'radio') {
    	      /** @type {NodeListOf<HTMLInputElement>} */
    	      const radios = popup.querySelectorAll("[name=\"".concat(swalClasses.radio, "\"]"));
    	      for (let i = 0; i < radios.length; i++) {
    	        radios[i].disabled = disabled;
    	      }
    	    } else {
    	      input.disabled = disabled;
    	    }
    	  }

    	  /**
    	   * Enable all the buttons
    	   * @this {SweetAlert}
    	   */
    	  function enableButtons() {
    	    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], false);
    	  }

    	  /**
    	   * Disable all the buttons
    	   * @this {SweetAlert}
    	   */
    	  function disableButtons() {
    	    setButtonsDisabled(this, ['confirmButton', 'denyButton', 'cancelButton'], true);
    	  }

    	  /**
    	   * Enable the input field
    	   * @this {SweetAlert}
    	   */
    	  function enableInput() {
    	    setInputDisabled(this.getInput(), false);
    	  }

    	  /**
    	   * Disable the input field
    	   * @this {SweetAlert}
    	   */
    	  function disableInput() {
    	    setInputDisabled(this.getInput(), true);
    	  }

    	  /**
    	   * Show block with validation message
    	   *
    	   * @param {string} error
    	   * @this {SweetAlert}
    	   */
    	  function showValidationMessage(error) {
    	    const domCache = privateProps.domCache.get(this);
    	    const params = privateProps.innerParams.get(this);
    	    setInnerHtml(domCache.validationMessage, error);
    	    domCache.validationMessage.className = swalClasses['validation-message'];
    	    if (params.customClass && params.customClass.validationMessage) {
    	      addClass(domCache.validationMessage, params.customClass.validationMessage);
    	    }
    	    show(domCache.validationMessage);
    	    const input = this.getInput();
    	    if (input) {
    	      input.setAttribute('aria-invalid', 'true');
    	      input.setAttribute('aria-describedby', swalClasses['validation-message']);
    	      focusInput(input);
    	      addClass(input, swalClasses.inputerror);
    	    }
    	  }

    	  /**
    	   * Hide block with validation message
    	   *
    	   * @this {SweetAlert}
    	   */
    	  function resetValidationMessage() {
    	    const domCache = privateProps.domCache.get(this);
    	    if (domCache.validationMessage) {
    	      hide(domCache.validationMessage);
    	    }
    	    const input = this.getInput();
    	    if (input) {
    	      input.removeAttribute('aria-invalid');
    	      input.removeAttribute('aria-describedby');
    	      removeClass(input, swalClasses.inputerror);
    	    }
    	  }

    	  const defaultParams = {
    	    title: '',
    	    titleText: '',
    	    text: '',
    	    html: '',
    	    footer: '',
    	    icon: undefined,
    	    iconColor: undefined,
    	    iconHtml: undefined,
    	    template: undefined,
    	    toast: false,
    	    showClass: {
    	      popup: 'swal2-show',
    	      backdrop: 'swal2-backdrop-show',
    	      icon: 'swal2-icon-show'
    	    },
    	    hideClass: {
    	      popup: 'swal2-hide',
    	      backdrop: 'swal2-backdrop-hide',
    	      icon: 'swal2-icon-hide'
    	    },
    	    customClass: {},
    	    target: 'body',
    	    color: undefined,
    	    backdrop: true,
    	    heightAuto: true,
    	    allowOutsideClick: true,
    	    allowEscapeKey: true,
    	    allowEnterKey: true,
    	    stopKeydownPropagation: true,
    	    keydownListenerCapture: false,
    	    showConfirmButton: true,
    	    showDenyButton: false,
    	    showCancelButton: false,
    	    preConfirm: undefined,
    	    preDeny: undefined,
    	    confirmButtonText: 'OK',
    	    confirmButtonAriaLabel: '',
    	    confirmButtonColor: undefined,
    	    denyButtonText: 'No',
    	    denyButtonAriaLabel: '',
    	    denyButtonColor: undefined,
    	    cancelButtonText: 'Cancel',
    	    cancelButtonAriaLabel: '',
    	    cancelButtonColor: undefined,
    	    buttonsStyling: true,
    	    reverseButtons: false,
    	    focusConfirm: true,
    	    focusDeny: false,
    	    focusCancel: false,
    	    returnFocus: true,
    	    showCloseButton: false,
    	    closeButtonHtml: '&times;',
    	    closeButtonAriaLabel: 'Close this dialog',
    	    loaderHtml: '',
    	    showLoaderOnConfirm: false,
    	    showLoaderOnDeny: false,
    	    imageUrl: undefined,
    	    imageWidth: undefined,
    	    imageHeight: undefined,
    	    imageAlt: '',
    	    timer: undefined,
    	    timerProgressBar: false,
    	    width: undefined,
    	    padding: undefined,
    	    background: undefined,
    	    input: undefined,
    	    inputPlaceholder: '',
    	    inputLabel: '',
    	    inputValue: '',
    	    inputOptions: {},
    	    inputAutoFocus: true,
    	    inputAutoTrim: true,
    	    inputAttributes: {},
    	    inputValidator: undefined,
    	    returnInputValueOnDeny: false,
    	    validationMessage: undefined,
    	    grow: false,
    	    position: 'center',
    	    progressSteps: [],
    	    currentProgressStep: undefined,
    	    progressStepsDistance: undefined,
    	    willOpen: undefined,
    	    didOpen: undefined,
    	    didRender: undefined,
    	    willClose: undefined,
    	    didClose: undefined,
    	    didDestroy: undefined,
    	    scrollbarPadding: true
    	  };
    	  const updatableParams = ['allowEscapeKey', 'allowOutsideClick', 'background', 'buttonsStyling', 'cancelButtonAriaLabel', 'cancelButtonColor', 'cancelButtonText', 'closeButtonAriaLabel', 'closeButtonHtml', 'color', 'confirmButtonAriaLabel', 'confirmButtonColor', 'confirmButtonText', 'currentProgressStep', 'customClass', 'denyButtonAriaLabel', 'denyButtonColor', 'denyButtonText', 'didClose', 'didDestroy', 'footer', 'hideClass', 'html', 'icon', 'iconColor', 'iconHtml', 'imageAlt', 'imageHeight', 'imageUrl', 'imageWidth', 'preConfirm', 'preDeny', 'progressSteps', 'returnFocus', 'reverseButtons', 'showCancelButton', 'showCloseButton', 'showConfirmButton', 'showDenyButton', 'text', 'title', 'titleText', 'willClose'];

    	  /** @type {Record<string, string>} */
    	  const deprecatedParams = {};
    	  const toastIncompatibleParams = ['allowOutsideClick', 'allowEnterKey', 'backdrop', 'focusConfirm', 'focusDeny', 'focusCancel', 'returnFocus', 'heightAuto', 'keydownListenerCapture'];

    	  /**
    	   * Is valid parameter
    	   *
    	   * @param {string} paramName
    	   * @returns {boolean}
    	   */
    	  const isValidParameter = paramName => {
    	    return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
    	  };

    	  /**
    	   * Is valid parameter for Swal.update() method
    	   *
    	   * @param {string} paramName
    	   * @returns {boolean}
    	   */
    	  const isUpdatableParameter = paramName => {
    	    return updatableParams.indexOf(paramName) !== -1;
    	  };

    	  /**
    	   * Is deprecated parameter
    	   *
    	   * @param {string} paramName
    	   * @returns {string | undefined}
    	   */
    	  const isDeprecatedParameter = paramName => {
    	    return deprecatedParams[paramName];
    	  };

    	  /**
    	   * @param {string} param
    	   */
    	  const checkIfParamIsValid = param => {
    	    if (!isValidParameter(param)) {
    	      warn("Unknown parameter \"".concat(param, "\""));
    	    }
    	  };

    	  /**
    	   * @param {string} param
    	   */
    	  const checkIfToastParamIsValid = param => {
    	    if (toastIncompatibleParams.includes(param)) {
    	      warn("The parameter \"".concat(param, "\" is incompatible with toasts"));
    	    }
    	  };

    	  /**
    	   * @param {string} param
    	   */
    	  const checkIfParamIsDeprecated = param => {
    	    const isDeprecated = isDeprecatedParameter(param);
    	    if (isDeprecated) {
    	      warnAboutDeprecation(param, isDeprecated);
    	    }
    	  };

    	  /**
    	   * Show relevant warnings for given params
    	   *
    	   * @param {SweetAlertOptions} params
    	   */
    	  const showWarningsForParams = params => {
    	    if (params.backdrop === false && params.allowOutsideClick) {
    	      warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
    	    }
    	    for (const param in params) {
    	      checkIfParamIsValid(param);
    	      if (params.toast) {
    	        checkIfToastParamIsValid(param);
    	      }
    	      checkIfParamIsDeprecated(param);
    	    }
    	  };

    	  /**
    	   * Updates popup parameters.
    	   *
    	   * @param {SweetAlertOptions} params
    	   */
    	  function update(params) {
    	    const popup = getPopup();
    	    const innerParams = privateProps.innerParams.get(this);
    	    if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
    	      warn("You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.");
    	      return;
    	    }
    	    const validUpdatableParams = filterValidParams(params);
    	    const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
    	    render(this, updatedParams);
    	    privateProps.innerParams.set(this, updatedParams);
    	    Object.defineProperties(this, {
    	      params: {
    	        value: Object.assign({}, this.params, params),
    	        writable: false,
    	        enumerable: true
    	      }
    	    });
    	  }

    	  /**
    	   * @param {SweetAlertOptions} params
    	   * @returns {SweetAlertOptions}
    	   */
    	  const filterValidParams = params => {
    	    const validUpdatableParams = {};
    	    Object.keys(params).forEach(param => {
    	      if (isUpdatableParameter(param)) {
    	        validUpdatableParams[param] = params[param];
    	      } else {
    	        warn("Invalid parameter to update: ".concat(param));
    	      }
    	    });
    	    return validUpdatableParams;
    	  };

    	  /**
    	   * Dispose the current SweetAlert2 instance
    	   */
    	  function _destroy() {
    	    const domCache = privateProps.domCache.get(this);
    	    const innerParams = privateProps.innerParams.get(this);
    	    if (!innerParams) {
    	      disposeWeakMaps(this); // The WeakMaps might have been partly destroyed, we must recall it to dispose any remaining WeakMaps #2335
    	      return; // This instance has already been destroyed
    	    }

    	    // Check if there is another Swal closing
    	    if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
    	      globalState.swalCloseEventFinishedCallback();
    	      delete globalState.swalCloseEventFinishedCallback;
    	    }
    	    if (typeof innerParams.didDestroy === 'function') {
    	      innerParams.didDestroy();
    	    }
    	    disposeSwal(this);
    	  }

    	  /**
    	   * @param {SweetAlert} instance
    	   */
    	  const disposeSwal = instance => {
    	    disposeWeakMaps(instance);
    	    // Unset this.params so GC will dispose it (#1569)
    	    delete instance.params;
    	    // Unset globalState props so GC will dispose globalState (#1569)
    	    delete globalState.keydownHandler;
    	    delete globalState.keydownTarget;
    	    // Unset currentInstance
    	    delete globalState.currentInstance;
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   */
    	  const disposeWeakMaps = instance => {
    	    // If the current instance is awaiting a promise result, we keep the privateMethods to call them once the promise result is retrieved #2335
    	    if (instance.isAwaitingPromise) {
    	      unsetWeakMaps(privateProps, instance);
    	      instance.isAwaitingPromise = true;
    	    } else {
    	      unsetWeakMaps(privateMethods, instance);
    	      unsetWeakMaps(privateProps, instance);
    	      delete instance.isAwaitingPromise;
    	      // Unset instance methods
    	      delete instance.disableButtons;
    	      delete instance.enableButtons;
    	      delete instance.getInput;
    	      delete instance.disableInput;
    	      delete instance.enableInput;
    	      delete instance.hideLoading;
    	      delete instance.disableLoading;
    	      delete instance.showValidationMessage;
    	      delete instance.resetValidationMessage;
    	      delete instance.close;
    	      delete instance.closePopup;
    	      delete instance.closeModal;
    	      delete instance.closeToast;
    	      delete instance.rejectPromise;
    	      delete instance.update;
    	      delete instance._destroy;
    	    }
    	  };

    	  /**
    	   * @param {object} obj
    	   * @param {SweetAlert} instance
    	   */
    	  const unsetWeakMaps = (obj, instance) => {
    	    for (const i in obj) {
    	      obj[i].delete(instance);
    	    }
    	  };

    	  var instanceMethods = /*#__PURE__*/Object.freeze({
    	    __proto__: null,
    	    _destroy: _destroy,
    	    close: close,
    	    closeModal: close,
    	    closePopup: close,
    	    closeToast: close,
    	    disableButtons: disableButtons,
    	    disableInput: disableInput,
    	    disableLoading: hideLoading,
    	    enableButtons: enableButtons,
    	    enableInput: enableInput,
    	    getInput: getInput,
    	    handleAwaitingPromise: handleAwaitingPromise,
    	    hideLoading: hideLoading,
    	    rejectPromise: rejectPromise,
    	    resetValidationMessage: resetValidationMessage,
    	    showValidationMessage: showValidationMessage,
    	    update: update
    	  });

    	  /**
    	   * @param {SweetAlertOptions} innerParams
    	   * @param {DomCache} domCache
    	   * @param {Function} dismissWith
    	   */
    	  const handlePopupClick = (innerParams, domCache, dismissWith) => {
    	    if (innerParams.toast) {
    	      handleToastClick(innerParams, domCache, dismissWith);
    	    } else {
    	      // Ignore click events that had mousedown on the popup but mouseup on the container
    	      // This can happen when the user drags a slider
    	      handleModalMousedown(domCache);

    	      // Ignore click events that had mousedown on the container but mouseup on the popup
    	      handleContainerMousedown(domCache);
    	      handleModalClick(innerParams, domCache, dismissWith);
    	    }
    	  };

    	  /**
    	   * @param {SweetAlertOptions} innerParams
    	   * @param {DomCache} domCache
    	   * @param {Function} dismissWith
    	   */
    	  const handleToastClick = (innerParams, domCache, dismissWith) => {
    	    // Closing toast by internal click
    	    domCache.popup.onclick = () => {
    	      if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
    	        return;
    	      }
    	      dismissWith(DismissReason.close);
    	    };
    	  };

    	  /**
    	   * @param {SweetAlertOptions} innerParams
    	   * @returns {boolean}
    	   */
    	  const isAnyButtonShown = innerParams => {
    	    return !!(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
    	  };
    	  let ignoreOutsideClick = false;

    	  /**
    	   * @param {DomCache} domCache
    	   */
    	  const handleModalMousedown = domCache => {
    	    domCache.popup.onmousedown = () => {
    	      domCache.container.onmouseup = function (e) {
    	        domCache.container.onmouseup = () => {};
    	        // We only check if the mouseup target is the container because usually it doesn't
    	        // have any other direct children aside of the popup
    	        if (e.target === domCache.container) {
    	          ignoreOutsideClick = true;
    	        }
    	      };
    	    };
    	  };

    	  /**
    	   * @param {DomCache} domCache
    	   */
    	  const handleContainerMousedown = domCache => {
    	    domCache.container.onmousedown = () => {
    	      domCache.popup.onmouseup = function (e) {
    	        domCache.popup.onmouseup = () => {};
    	        // We also need to check if the mouseup target is a child of the popup
    	        if (e.target === domCache.popup || e.target instanceof HTMLElement && domCache.popup.contains(e.target)) {
    	          ignoreOutsideClick = true;
    	        }
    	      };
    	    };
    	  };

    	  /**
    	   * @param {SweetAlertOptions} innerParams
    	   * @param {DomCache} domCache
    	   * @param {Function} dismissWith
    	   */
    	  const handleModalClick = (innerParams, domCache, dismissWith) => {
    	    domCache.container.onclick = e => {
    	      if (ignoreOutsideClick) {
    	        ignoreOutsideClick = false;
    	        return;
    	      }
    	      if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
    	        dismissWith(DismissReason.backdrop);
    	      }
    	    };
    	  };

    	  const isJqueryElement = elem => typeof elem === 'object' && elem.jquery;
    	  const isElement = elem => elem instanceof Element || isJqueryElement(elem);
    	  const argsToParams = args => {
    	    const params = {};
    	    if (typeof args[0] === 'object' && !isElement(args[0])) {
    	      Object.assign(params, args[0]);
    	    } else {
    	      ['title', 'html', 'icon'].forEach((name, index) => {
    	        const arg = args[index];
    	        if (typeof arg === 'string' || isElement(arg)) {
    	          params[name] = arg;
    	        } else if (arg !== undefined) {
    	          error("Unexpected type of ".concat(name, "! Expected \"string\" or \"Element\", got ").concat(typeof arg));
    	        }
    	      });
    	    }
    	    return params;
    	  };

    	  /**
    	   * Main method to create a new SweetAlert2 popup
    	   *
    	   * @param  {...SweetAlertOptions} args
    	   * @returns {Promise<SweetAlertResult>}
    	   */
    	  function fire() {
    	    const Swal = this; // eslint-disable-line @typescript-eslint/no-this-alias
    	    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    	      args[_key] = arguments[_key];
    	    }
    	    return new Swal(...args);
    	  }

    	  /**
    	   * Returns an extended version of `Swal` containing `params` as defaults.
    	   * Useful for reusing Swal configuration.
    	   *
    	   * For example:
    	   *
    	   * Before:
    	   * const textPromptOptions = { input: 'text', showCancelButton: true }
    	   * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
    	   * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
    	   *
    	   * After:
    	   * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
    	   * const {value: firstName} = await TextPrompt('What is your first name?')
    	   * const {value: lastName} = await TextPrompt('What is your last name?')
    	   *
    	   * @param {SweetAlertOptions} mixinParams
    	   * @returns {SweetAlert}
    	   */
    	  function mixin(mixinParams) {
    	    class MixinSwal extends this {
    	      _main(params, priorityMixinParams) {
    	        return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
    	      }
    	    }
    	    // @ts-ignore
    	    return MixinSwal;
    	  }

    	  /**
    	   * If `timer` parameter is set, returns number of milliseconds of timer remained.
    	   * Otherwise, returns undefined.
    	   *
    	   * @returns {number | undefined}
    	   */
    	  const getTimerLeft = () => {
    	    return globalState.timeout && globalState.timeout.getTimerLeft();
    	  };

    	  /**
    	   * Stop timer. Returns number of milliseconds of timer remained.
    	   * If `timer` parameter isn't set, returns undefined.
    	   *
    	   * @returns {number | undefined}
    	   */
    	  const stopTimer = () => {
    	    if (globalState.timeout) {
    	      stopTimerProgressBar();
    	      return globalState.timeout.stop();
    	    }
    	  };

    	  /**
    	   * Resume timer. Returns number of milliseconds of timer remained.
    	   * If `timer` parameter isn't set, returns undefined.
    	   *
    	   * @returns {number | undefined}
    	   */
    	  const resumeTimer = () => {
    	    if (globalState.timeout) {
    	      const remaining = globalState.timeout.start();
    	      animateTimerProgressBar(remaining);
    	      return remaining;
    	    }
    	  };

    	  /**
    	   * Resume timer. Returns number of milliseconds of timer remained.
    	   * If `timer` parameter isn't set, returns undefined.
    	   *
    	   * @returns {number | undefined}
    	   */
    	  const toggleTimer = () => {
    	    const timer = globalState.timeout;
    	    return timer && (timer.running ? stopTimer() : resumeTimer());
    	  };

    	  /**
    	   * Increase timer. Returns number of milliseconds of an updated timer.
    	   * If `timer` parameter isn't set, returns undefined.
    	   *
    	   * @param {number} ms
    	   * @returns {number | undefined}
    	   */
    	  const increaseTimer = ms => {
    	    if (globalState.timeout) {
    	      const remaining = globalState.timeout.increase(ms);
    	      animateTimerProgressBar(remaining, true);
    	      return remaining;
    	    }
    	  };

    	  /**
    	   * Check if timer is running. Returns true if timer is running
    	   * or false if timer is paused or stopped.
    	   * If `timer` parameter isn't set, returns undefined
    	   *
    	   * @returns {boolean}
    	   */
    	  const isTimerRunning = () => {
    	    return !!(globalState.timeout && globalState.timeout.isRunning());
    	  };

    	  let bodyClickListenerAdded = false;
    	  const clickHandlers = {};

    	  /**
    	   * @param {string} attr
    	   */
    	  function bindClickHandler() {
    	    let attr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'data-swal-template';
    	    clickHandlers[attr] = this;
    	    if (!bodyClickListenerAdded) {
    	      document.body.addEventListener('click', bodyClickListener);
    	      bodyClickListenerAdded = true;
    	    }
    	  }
    	  const bodyClickListener = event => {
    	    for (let el = event.target; el && el !== document; el = el.parentNode) {
    	      for (const attr in clickHandlers) {
    	        const template = el.getAttribute(attr);
    	        if (template) {
    	          clickHandlers[attr].fire({
    	            template
    	          });
    	          return;
    	        }
    	      }
    	    }
    	  };

    	  var staticMethods = /*#__PURE__*/Object.freeze({
    	    __proto__: null,
    	    argsToParams: argsToParams,
    	    bindClickHandler: bindClickHandler,
    	    clickCancel: clickCancel,
    	    clickConfirm: clickConfirm,
    	    clickDeny: clickDeny,
    	    enableLoading: showLoading,
    	    fire: fire,
    	    getActions: getActions,
    	    getCancelButton: getCancelButton,
    	    getCloseButton: getCloseButton,
    	    getConfirmButton: getConfirmButton,
    	    getContainer: getContainer,
    	    getDenyButton: getDenyButton,
    	    getFocusableElements: getFocusableElements,
    	    getFooter: getFooter,
    	    getHtmlContainer: getHtmlContainer,
    	    getIcon: getIcon,
    	    getIconContent: getIconContent,
    	    getImage: getImage,
    	    getInputLabel: getInputLabel,
    	    getLoader: getLoader,
    	    getPopup: getPopup,
    	    getProgressSteps: getProgressSteps,
    	    getTimerLeft: getTimerLeft,
    	    getTimerProgressBar: getTimerProgressBar,
    	    getTitle: getTitle,
    	    getValidationMessage: getValidationMessage,
    	    increaseTimer: increaseTimer,
    	    isDeprecatedParameter: isDeprecatedParameter,
    	    isLoading: isLoading,
    	    isTimerRunning: isTimerRunning,
    	    isUpdatableParameter: isUpdatableParameter,
    	    isValidParameter: isValidParameter,
    	    isVisible: isVisible,
    	    mixin: mixin,
    	    resumeTimer: resumeTimer,
    	    showLoading: showLoading,
    	    stopTimer: stopTimer,
    	    toggleTimer: toggleTimer
    	  });

    	  class Timer {
    	    /**
    	     * @param {Function} callback
    	     * @param {number} delay
    	     */
    	    constructor(callback, delay) {
    	      this.callback = callback;
    	      this.remaining = delay;
    	      this.running = false;
    	      this.start();
    	    }

    	    /**
    	     * @returns {number}
    	     */
    	    start() {
    	      if (!this.running) {
    	        this.running = true;
    	        this.started = new Date();
    	        this.id = setTimeout(this.callback, this.remaining);
    	      }
    	      return this.remaining;
    	    }

    	    /**
    	     * @returns {number}
    	     */
    	    stop() {
    	      if (this.started && this.running) {
    	        this.running = false;
    	        clearTimeout(this.id);
    	        this.remaining -= new Date().getTime() - this.started.getTime();
    	      }
    	      return this.remaining;
    	    }

    	    /**
    	     * @param {number} n
    	     * @returns {number}
    	     */
    	    increase(n) {
    	      const running = this.running;
    	      if (running) {
    	        this.stop();
    	      }
    	      this.remaining += n;
    	      if (running) {
    	        this.start();
    	      }
    	      return this.remaining;
    	    }

    	    /**
    	     * @returns {number}
    	     */
    	    getTimerLeft() {
    	      if (this.running) {
    	        this.stop();
    	        this.start();
    	      }
    	      return this.remaining;
    	    }

    	    /**
    	     * @returns {boolean}
    	     */
    	    isRunning() {
    	      return this.running;
    	    }
    	  }

    	  const swalStringParams = ['swal-title', 'swal-html', 'swal-footer'];

    	  /**
    	   * @param {SweetAlertOptions} params
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getTemplateParams = params => {
    	    /** @type {HTMLTemplateElement} */
    	    const template = typeof params.template === 'string' ? document.querySelector(params.template) : params.template;
    	    if (!template) {
    	      return {};
    	    }
    	    /** @type {DocumentFragment} */
    	    const templateContent = template.content;
    	    showWarningsForElements(templateContent);
    	    const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getSwalParams = templateContent => {
    	    const result = {};
    	    /** @type {HTMLElement[]} */
    	    const swalParams = Array.from(templateContent.querySelectorAll('swal-param'));
    	    swalParams.forEach(param => {
    	      showWarningsForAttributes(param, ['name', 'value']);
    	      const paramName = param.getAttribute('name');
    	      const value = param.getAttribute('value');
    	      if (typeof defaultParams[paramName] === 'boolean') {
    	        result[paramName] = value !== 'false';
    	      } else if (typeof defaultParams[paramName] === 'object') {
    	        result[paramName] = JSON.parse(value);
    	      } else {
    	        result[paramName] = value;
    	      }
    	    });
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getSwalFunctionParams = templateContent => {
    	    const result = {};
    	    /** @type {HTMLElement[]} */
    	    const swalFunctions = Array.from(templateContent.querySelectorAll('swal-function-param'));
    	    swalFunctions.forEach(param => {
    	      const paramName = param.getAttribute('name');
    	      const value = param.getAttribute('value');
    	      result[paramName] = new Function("return ".concat(value))();
    	    });
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getSwalButtons = templateContent => {
    	    const result = {};
    	    /** @type {HTMLElement[]} */
    	    const swalButtons = Array.from(templateContent.querySelectorAll('swal-button'));
    	    swalButtons.forEach(button => {
    	      showWarningsForAttributes(button, ['type', 'color', 'aria-label']);
    	      const type = button.getAttribute('type');
    	      result["".concat(type, "ButtonText")] = button.innerHTML;
    	      result["show".concat(capitalizeFirstLetter(type), "Button")] = true;
    	      if (button.hasAttribute('color')) {
    	        result["".concat(type, "ButtonColor")] = button.getAttribute('color');
    	      }
    	      if (button.hasAttribute('aria-label')) {
    	        result["".concat(type, "ButtonAriaLabel")] = button.getAttribute('aria-label');
    	      }
    	    });
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getSwalImage = templateContent => {
    	    const result = {};
    	    /** @type {HTMLElement} */
    	    const image = templateContent.querySelector('swal-image');
    	    if (image) {
    	      showWarningsForAttributes(image, ['src', 'width', 'height', 'alt']);
    	      if (image.hasAttribute('src')) {
    	        result.imageUrl = image.getAttribute('src');
    	      }
    	      if (image.hasAttribute('width')) {
    	        result.imageWidth = image.getAttribute('width');
    	      }
    	      if (image.hasAttribute('height')) {
    	        result.imageHeight = image.getAttribute('height');
    	      }
    	      if (image.hasAttribute('alt')) {
    	        result.imageAlt = image.getAttribute('alt');
    	      }
    	    }
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getSwalIcon = templateContent => {
    	    const result = {};
    	    /** @type {HTMLElement} */
    	    const icon = templateContent.querySelector('swal-icon');
    	    if (icon) {
    	      showWarningsForAttributes(icon, ['type', 'color']);
    	      if (icon.hasAttribute('type')) {
    	        /** @type {SweetAlertIcon} */
    	        // @ts-ignore
    	        result.icon = icon.getAttribute('type');
    	      }
    	      if (icon.hasAttribute('color')) {
    	        result.iconColor = icon.getAttribute('color');
    	      }
    	      result.iconHtml = icon.innerHTML;
    	    }
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getSwalInput = templateContent => {
    	    const result = {};
    	    /** @type {HTMLElement} */
    	    const input = templateContent.querySelector('swal-input');
    	    if (input) {
    	      showWarningsForAttributes(input, ['type', 'label', 'placeholder', 'value']);
    	      /** @type {SweetAlertInput} */
    	      // @ts-ignore
    	      result.input = input.getAttribute('type') || 'text';
    	      if (input.hasAttribute('label')) {
    	        result.inputLabel = input.getAttribute('label');
    	      }
    	      if (input.hasAttribute('placeholder')) {
    	        result.inputPlaceholder = input.getAttribute('placeholder');
    	      }
    	      if (input.hasAttribute('value')) {
    	        result.inputValue = input.getAttribute('value');
    	      }
    	    }
    	    /** @type {HTMLElement[]} */
    	    const inputOptions = Array.from(templateContent.querySelectorAll('swal-input-option'));
    	    if (inputOptions.length) {
    	      result.inputOptions = {};
    	      inputOptions.forEach(option => {
    	        showWarningsForAttributes(option, ['value']);
    	        const optionValue = option.getAttribute('value');
    	        const optionName = option.innerHTML;
    	        result.inputOptions[optionValue] = optionName;
    	      });
    	    }
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   * @param {string[]} paramNames
    	   * @returns {SweetAlertOptions}
    	   */
    	  const getSwalStringParams = (templateContent, paramNames) => {
    	    const result = {};
    	    for (const i in paramNames) {
    	      const paramName = paramNames[i];
    	      /** @type {HTMLElement} */
    	      const tag = templateContent.querySelector(paramName);
    	      if (tag) {
    	        showWarningsForAttributes(tag, []);
    	        result[paramName.replace(/^swal-/, '')] = tag.innerHTML.trim();
    	      }
    	    }
    	    return result;
    	  };

    	  /**
    	   * @param {DocumentFragment} templateContent
    	   */
    	  const showWarningsForElements = templateContent => {
    	    const allowedElements = swalStringParams.concat(['swal-param', 'swal-function-param', 'swal-button', 'swal-image', 'swal-icon', 'swal-input', 'swal-input-option']);
    	    Array.from(templateContent.children).forEach(el => {
    	      const tagName = el.tagName.toLowerCase();
    	      if (!allowedElements.includes(tagName)) {
    	        warn("Unrecognized element <".concat(tagName, ">"));
    	      }
    	    });
    	  };

    	  /**
    	   * @param {HTMLElement} el
    	   * @param {string[]} allowedAttributes
    	   */
    	  const showWarningsForAttributes = (el, allowedAttributes) => {
    	    Array.from(el.attributes).forEach(attribute => {
    	      if (allowedAttributes.indexOf(attribute.name) === -1) {
    	        warn(["Unrecognized attribute \"".concat(attribute.name, "\" on <").concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(', ')) : 'To set the value, use HTML within the element.')]);
    	      }
    	    });
    	  };

    	  const SHOW_CLASS_TIMEOUT = 10;

    	  /**
    	   * Open popup, add necessary classes and styles, fix scrollbar
    	   *
    	   * @param {SweetAlertOptions} params
    	   */
    	  const openPopup = params => {
    	    const container = getContainer();
    	    const popup = getPopup();
    	    if (typeof params.willOpen === 'function') {
    	      params.willOpen(popup);
    	    }
    	    const bodyStyles = window.getComputedStyle(document.body);
    	    const initialBodyOverflow = bodyStyles.overflowY;
    	    addClasses(container, popup, params);

    	    // scrolling is 'hidden' until animation is done, after that 'auto'
    	    setTimeout(() => {
    	      setScrollingVisibility(container, popup);
    	    }, SHOW_CLASS_TIMEOUT);
    	    if (isModal()) {
    	      fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
    	      setAriaHidden();
    	    }
    	    if (!isToast() && !globalState.previousActiveElement) {
    	      globalState.previousActiveElement = document.activeElement;
    	    }
    	    if (typeof params.didOpen === 'function') {
    	      setTimeout(() => params.didOpen(popup));
    	    }
    	    removeClass(container, swalClasses['no-transition']);
    	  };

    	  /**
    	   * @param {AnimationEvent} event
    	   */
    	  const swalOpenAnimationFinished = event => {
    	    const popup = getPopup();
    	    if (event.target !== popup || !animationEndEvent) {
    	      return;
    	    }
    	    const container = getContainer();
    	    popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished);
    	    container.style.overflowY = 'auto';
    	  };

    	  /**
    	   * @param {HTMLElement} container
    	   * @param {HTMLElement} popup
    	   */
    	  const setScrollingVisibility = (container, popup) => {
    	    if (animationEndEvent && hasCssAnimation(popup)) {
    	      container.style.overflowY = 'hidden';
    	      popup.addEventListener(animationEndEvent, swalOpenAnimationFinished);
    	    } else {
    	      container.style.overflowY = 'auto';
    	    }
    	  };

    	  /**
    	   * @param {HTMLElement} container
    	   * @param {boolean} scrollbarPadding
    	   * @param {string} initialBodyOverflow
    	   */
    	  const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
    	    iOSfix();
    	    if (scrollbarPadding && initialBodyOverflow !== 'hidden') {
    	      replaceScrollbarWithPadding(initialBodyOverflow);
    	    }

    	    // sweetalert2/issues/1247
    	    setTimeout(() => {
    	      container.scrollTop = 0;
    	    });
    	  };

    	  /**
    	   * @param {HTMLElement} container
    	   * @param {HTMLElement} popup
    	   * @param {SweetAlertOptions} params
    	   */
    	  const addClasses = (container, popup, params) => {
    	    addClass(container, params.showClass.backdrop);
    	    // this workaround with opacity is needed for https://github.com/sweetalert2/sweetalert2/issues/2059
    	    popup.style.setProperty('opacity', '0', 'important');
    	    show(popup, 'grid');
    	    setTimeout(() => {
    	      // Animate popup right after showing it
    	      addClass(popup, params.showClass.popup);
    	      // and remove the opacity workaround
    	      popup.style.removeProperty('opacity');
    	    }, SHOW_CLASS_TIMEOUT); // 10ms in order to fix #2062

    	    addClass([document.documentElement, document.body], swalClasses.shown);
    	    if (params.heightAuto && params.backdrop && !params.toast) {
    	      addClass([document.documentElement, document.body], swalClasses['height-auto']);
    	    }
    	  };

    	  var defaultInputValidators = {
    	    /**
    	     * @param {string} string
    	     * @param {string} [validationMessage]
    	     * @returns {Promise<string | void>}
    	     */
    	    email: (string, validationMessage) => {
    	      return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid email address');
    	    },
    	    /**
    	     * @param {string} string
    	     * @param {string} [validationMessage]
    	     * @returns {Promise<string | void>}
    	     */
    	    url: (string, validationMessage) => {
    	      // taken from https://stackoverflow.com/a/3809435 with a small change from #1306 and #2013
    	      return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || 'Invalid URL');
    	    }
    	  };

    	  /**
    	   * @param {SweetAlertOptions} params
    	   */
    	  function setDefaultInputValidators(params) {
    	    // Use default `inputValidator` for supported input types if not provided
    	    if (params.inputValidator) {
    	      return;
    	    }
    	    if (params.input === 'email') {
    	      params.inputValidator = defaultInputValidators['email'];
    	    }
    	    if (params.input === 'url') {
    	      params.inputValidator = defaultInputValidators['url'];
    	    }
    	  }

    	  /**
    	   * @param {SweetAlertOptions} params
    	   */
    	  function validateCustomTargetElement(params) {
    	    // Determine if the custom target element is valid
    	    if (!params.target || typeof params.target === 'string' && !document.querySelector(params.target) || typeof params.target !== 'string' && !params.target.appendChild) {
    	      warn('Target parameter is not valid, defaulting to "body"');
    	      params.target = 'body';
    	    }
    	  }

    	  /**
    	   * Set type, text and actions on popup
    	   *
    	   * @param {SweetAlertOptions} params
    	   */
    	  function setParameters(params) {
    	    setDefaultInputValidators(params);

    	    // showLoaderOnConfirm && preConfirm
    	    if (params.showLoaderOnConfirm && !params.preConfirm) {
    	      warn('showLoaderOnConfirm is set to true, but preConfirm is not defined.\n' + 'showLoaderOnConfirm should be used together with preConfirm, see usage example:\n' + 'https://sweetalert2.github.io/#ajax-request');
    	    }
    	    validateCustomTargetElement(params);

    	    // Replace newlines with <br> in title
    	    if (typeof params.title === 'string') {
    	      params.title = params.title.split('\n').join('<br />');
    	    }
    	    init(params);
    	  }

    	  /** @type {SweetAlert} */
    	  let currentInstance;
    	  var _promise = /*#__PURE__*/new WeakMap();
    	  class SweetAlert {
    	    /**
    	     * @param {...any} args
    	     * @this {SweetAlert}
    	     */
    	    constructor() {
    	      /**
    	       * @type {Promise<SweetAlertResult>}
    	       */
    	      _classPrivateFieldInitSpec(this, _promise, {
    	        writable: true,
    	        value: void 0
    	      });
    	      // Prevent run in Node env
    	      if (typeof window === 'undefined') {
    	        return;
    	      }
    	      currentInstance = this;

    	      // @ts-ignore
    	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    	        args[_key] = arguments[_key];
    	      }
    	      const outerParams = Object.freeze(this.constructor.argsToParams(args));

    	      /** @type {Readonly<SweetAlertOptions>} */
    	      this.params = outerParams;

    	      /** @type {boolean} */
    	      this.isAwaitingPromise = false;
    	      _classPrivateFieldSet(this, _promise, this._main(currentInstance.params));
    	    }
    	    _main(userParams) {
    	      let mixinParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    	      showWarningsForParams(Object.assign({}, mixinParams, userParams));
    	      if (globalState.currentInstance) {
    	        globalState.currentInstance._destroy();
    	        if (isModal()) {
    	          unsetAriaHidden();
    	        }
    	      }
    	      globalState.currentInstance = currentInstance;
    	      const innerParams = prepareParams(userParams, mixinParams);
    	      setParameters(innerParams);
    	      Object.freeze(innerParams);

    	      // clear the previous timer
    	      if (globalState.timeout) {
    	        globalState.timeout.stop();
    	        delete globalState.timeout;
    	      }

    	      // clear the restore focus timeout
    	      clearTimeout(globalState.restoreFocusTimeout);
    	      const domCache = populateDomCache(currentInstance);
    	      render(currentInstance, innerParams);
    	      privateProps.innerParams.set(currentInstance, innerParams);
    	      return swalPromise(currentInstance, domCache, innerParams);
    	    }

    	    // `catch` cannot be the name of a module export, so we define our thenable methods here instead
    	    then(onFulfilled) {
    	      return _classPrivateFieldGet(this, _promise).then(onFulfilled);
    	    }
    	    finally(onFinally) {
    	      return _classPrivateFieldGet(this, _promise).finally(onFinally);
    	    }
    	  }

    	  /**
    	   * @param {SweetAlert} instance
    	   * @param {DomCache} domCache
    	   * @param {SweetAlertOptions} innerParams
    	   * @returns {Promise}
    	   */
    	  const swalPromise = (instance, domCache, innerParams) => {
    	    return new Promise((resolve, reject) => {
    	      // functions to handle all closings/dismissals
    	      /**
    	       * @param {DismissReason} dismiss
    	       */
    	      const dismissWith = dismiss => {
    	        instance.close({
    	          isDismissed: true,
    	          dismiss
    	        });
    	      };
    	      privateMethods.swalPromiseResolve.set(instance, resolve);
    	      privateMethods.swalPromiseReject.set(instance, reject);
    	      domCache.confirmButton.onclick = () => {
    	        handleConfirmButtonClick(instance);
    	      };
    	      domCache.denyButton.onclick = () => {
    	        handleDenyButtonClick(instance);
    	      };
    	      domCache.cancelButton.onclick = () => {
    	        handleCancelButtonClick(instance, dismissWith);
    	      };
    	      domCache.closeButton.onclick = () => {
    	        dismissWith(DismissReason.close);
    	      };
    	      handlePopupClick(innerParams, domCache, dismissWith);
    	      addKeydownHandler(globalState, innerParams, dismissWith);
    	      handleInputOptionsAndValue(instance, innerParams);
    	      openPopup(innerParams);
    	      setupTimer(globalState, innerParams, dismissWith);
    	      initFocus(domCache, innerParams);

    	      // Scroll container to top on open (#1247, #1946)
    	      setTimeout(() => {
    	        domCache.container.scrollTop = 0;
    	      });
    	    });
    	  };

    	  /**
    	   * @param {SweetAlertOptions} userParams
    	   * @param {SweetAlertOptions} mixinParams
    	   * @returns {SweetAlertOptions}
    	   */
    	  const prepareParams = (userParams, mixinParams) => {
    	    const templateParams = getTemplateParams(userParams);
    	    const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams); // precedence is described in #2131
    	    params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
    	    params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
    	    return params;
    	  };

    	  /**
    	   * @param {SweetAlert} instance
    	   * @returns {DomCache}
    	   */
    	  const populateDomCache = instance => {
    	    const domCache = {
    	      popup: getPopup(),
    	      container: getContainer(),
    	      actions: getActions(),
    	      confirmButton: getConfirmButton(),
    	      denyButton: getDenyButton(),
    	      cancelButton: getCancelButton(),
    	      loader: getLoader(),
    	      closeButton: getCloseButton(),
    	      validationMessage: getValidationMessage(),
    	      progressSteps: getProgressSteps()
    	    };
    	    privateProps.domCache.set(instance, domCache);
    	    return domCache;
    	  };

    	  /**
    	   * @param {GlobalState} globalState
    	   * @param {SweetAlertOptions} innerParams
    	   * @param {Function} dismissWith
    	   */
    	  const setupTimer = (globalState, innerParams, dismissWith) => {
    	    const timerProgressBar = getTimerProgressBar();
    	    hide(timerProgressBar);
    	    if (innerParams.timer) {
    	      globalState.timeout = new Timer(() => {
    	        dismissWith('timer');
    	        delete globalState.timeout;
    	      }, innerParams.timer);
    	      if (innerParams.timerProgressBar) {
    	        show(timerProgressBar);
    	        applyCustomClass(timerProgressBar, innerParams, 'timerProgressBar');
    	        setTimeout(() => {
    	          if (globalState.timeout && globalState.timeout.running) {
    	            // timer can be already stopped or unset at this point
    	            animateTimerProgressBar(innerParams.timer);
    	          }
    	        });
    	      }
    	    }
    	  };

    	  /**
    	   * @param {DomCache} domCache
    	   * @param {SweetAlertOptions} innerParams
    	   */
    	  const initFocus = (domCache, innerParams) => {
    	    if (innerParams.toast) {
    	      return;
    	    }
    	    if (!callIfFunction(innerParams.allowEnterKey)) {
    	      blurActiveElement();
    	      return;
    	    }
    	    if (!focusButton(domCache, innerParams)) {
    	      setFocus(-1, 1);
    	    }
    	  };

    	  /**
    	   * @param {DomCache} domCache
    	   * @param {SweetAlertOptions} innerParams
    	   * @returns {boolean}
    	   */
    	  const focusButton = (domCache, innerParams) => {
    	    if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
    	      domCache.denyButton.focus();
    	      return true;
    	    }
    	    if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
    	      domCache.cancelButton.focus();
    	      return true;
    	    }
    	    if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
    	      domCache.confirmButton.focus();
    	      return true;
    	    }
    	    return false;
    	  };
    	  const blurActiveElement = () => {
    	    if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === 'function') {
    	      document.activeElement.blur();
    	    }
    	  };

    	  // Dear russian users visiting russian sites. Let's have fun.
    	  if (typeof window !== 'undefined' && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|by|xn--p1ai)$/)) {
    	    const now = new Date();
    	    const initiationDate = localStorage.getItem('swal-initiation');
    	    if (!initiationDate) {
    	      localStorage.setItem('swal-initiation', "".concat(now));
    	    } else if ((now.getTime() - Date.parse(initiationDate)) / (1000 * 60 * 60 * 24) > 3) {
    	      setTimeout(() => {
    	        document.body.style.pointerEvents = 'none';
    	        const ukrainianAnthem = document.createElement('audio');
    	        ukrainianAnthem.src = 'https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3';
    	        ukrainianAnthem.loop = true;
    	        document.body.appendChild(ukrainianAnthem);
    	        setTimeout(() => {
    	          ukrainianAnthem.play().catch(() => {
    	            // ignore
    	          });
    	        }, 2500);
    	      }, 500);
    	    }
    	  }

    	  // Assign instance methods from src/instanceMethods/*.js to prototype
    	  SweetAlert.prototype.disableButtons = disableButtons;
    	  SweetAlert.prototype.enableButtons = enableButtons;
    	  SweetAlert.prototype.getInput = getInput;
    	  SweetAlert.prototype.disableInput = disableInput;
    	  SweetAlert.prototype.enableInput = enableInput;
    	  SweetAlert.prototype.hideLoading = hideLoading;
    	  SweetAlert.prototype.disableLoading = hideLoading;
    	  SweetAlert.prototype.showValidationMessage = showValidationMessage;
    	  SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
    	  SweetAlert.prototype.close = close;
    	  SweetAlert.prototype.closePopup = close;
    	  SweetAlert.prototype.closeModal = close;
    	  SweetAlert.prototype.closeToast = close;
    	  SweetAlert.prototype.rejectPromise = rejectPromise;
    	  SweetAlert.prototype.update = update;
    	  SweetAlert.prototype._destroy = _destroy;

    	  // Assign static methods from src/staticMethods/*.js to constructor
    	  Object.assign(SweetAlert, staticMethods);

    	  // Proxy to instance methods to constructor, for now, for backwards compatibility
    	  Object.keys(instanceMethods).forEach(key => {
    	    /**
    	     * @param {...any} args
    	     * @returns {any | undefined}
    	     */
    	    SweetAlert[key] = function () {
    	      if (currentInstance && currentInstance[key]) {
    	        return currentInstance[key](...arguments);
    	      }
    	      return null;
    	    };
    	  });
    	  SweetAlert.DismissReason = DismissReason;
    	  SweetAlert.version = '11.9.0';

    	  const Swal = SweetAlert;
    	  // @ts-ignore
    	  Swal.default = Swal;

    	  return Swal;

    	}));
    	if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal.Sweetalert2){commonjsGlobal.swal = commonjsGlobal.sweetAlert = commonjsGlobal.Swal = commonjsGlobal.SweetAlert = commonjsGlobal.Sweetalert2;}
    	"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t;}catch(e){n.innerText=t;}}(document,".swal2-popup.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;background:#fff;box-shadow:0 0 1px rgba(0,0,0,.075),0 1px 2px rgba(0,0,0,.075),1px 2px 4px rgba(0,0,0,.075),1px 3px 8px rgba(0,0,0,.075),2px 4px 16px rgba(0,0,0,.075);pointer-events:all}.swal2-popup.swal2-toast>*{grid-column:2}.swal2-popup.swal2-toast .swal2-title{margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.5em;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-popup.swal2-toast .swal2-html-container{margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-popup.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-popup.swal2-toast .swal2-styled{margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{animation:swal2-toast-hide .1s forwards}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:\"top-start     top            top-end\" \"center-start  center         center-end\" \"bottom-start  bottom-center  bottom-end\";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:rgba(0,0,0,.4)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;align-self:start;justify-self:center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;align-self:start;justify-self:end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;align-self:center;justify-self:center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;align-self:center;justify-self:end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;justify-self:center;align-self:end}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;align-self:end;justify-self:end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:32em;max-width:100%;padding:0 0 1.25em;border:none;border-radius:5px;background:#fff;color:#545454;font-family:inherit;font-size:1rem}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:.8em 1em 0;color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:auto;margin:1.25em auto 0;padding:0}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))}div:where(.swal2-container) div:where(.swal2-actions):not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:box-shadow .1s;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#7066e0;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm:focus{box-shadow:0 0 0 3px rgba(112,102,224,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#dc3741;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-deny:focus{box-shadow:0 0 0 3px rgba(220,55,65,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#6e7881;color:#fff;font-size:1em}div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel:focus{box-shadow:0 0 0 3px rgba(110,120,129,.5)}div:where(.swal2-container) button:where(.swal2-styled).swal2-default-outline:focus{box-shadow:0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-styled):focus{outline:none}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid #eee;color:inherit;font-size:1em;text-align:center}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:rgba(0,0,0,.2)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em}div:where(.swal2-container) button:where(.swal2-close){z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:color .1s,box-shadow .1s;border:none;border-radius:5px;background:rgba(0,0,0,0);color:#ccc;font-family:monospace;font-size:2.5em;cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:none;background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus{outline:none;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) .swal2-html-container{z-index:1;justify-content:center;margin:1em 1.6em .3em;padding:0;overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;word-wrap:break-word;word-break:break-word}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:border-color .1s,box-shadow .1s;border:1px solid #d9d9d9;border-radius:.1875em;background:rgba(0,0,0,0);box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:1px solid #b4dbed;outline:none;box-shadow:inset 0 1px 1px rgba(0,0,0,.06),0 0 0 3px rgba(100,150,200,.5)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:#fff}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:rgba(0,0,0,0);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:rgba(0,0,0,0);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:#fff;color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:\"!\";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;border:0.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}div:where(.swal2-icon).swal2-warning{border-color:#facea8;color:#f8bb86}div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}div:where(.swal2-icon).swal2-info{border-color:#9de0f6;color:#3fc3ee}div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}div:where(.swal2-icon).swal2-question{border-color:#c9dae1;color:#87adbd}div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:swal2-show .3s}.swal2-hide{animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-show{0%{transform:scale(0.7)}45%{transform:scale(1.05)}80%{transform:scale(0.95)}100%{transform:scale(1)}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(0.5);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static !important}}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}"); 
    } (sweetalert2_all));

    var sweetalert2_allExports = sweetalert2_all.exports;
    var Swal = /*@__PURE__*/getDefaultExportFromCjs(sweetalert2_allExports);

    /* src\Components\Contact.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$a = "src\\Components\\Contact.svelte";

    function create_fragment$a(ctx) {
    	let section;
    	let div27;
    	let div26;
    	let div17;
    	let div16;
    	let h6;
    	let t1;
    	let p0;
    	let t3;
    	let form;
    	let div15;
    	let div1;
    	let div0;
    	let label0;
    	let t5;
    	let input0;
    	let t6;
    	let div3;
    	let div2;
    	let label1;
    	let t8;
    	let input1;
    	let t9;
    	let div5;
    	let div4;
    	let label2;
    	let t11;
    	let input2;
    	let t12;
    	let div7;
    	let div6;
    	let label3;
    	let t14;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let t19;
    	let div9;
    	let div8;
    	let label4;
    	let t21;
    	let input3;
    	let t22;
    	let div11;
    	let div10;
    	let label5;
    	let t24;
    	let textarea;
    	let t25;
    	let div12;
    	let t26;
    	let div14;
    	let div13;
    	let button;
    	let t28;
    	let div25;
    	let div18;
    	let iframe;
    	let iframe_src_value;
    	let t29;
    	let ul;
    	let li0;
    	let div19;
    	let i0;
    	let t30;
    	let div20;
    	let h50;
    	let t32;
    	let p1;
    	let a0;
    	let t33;
    	let t34;
    	let li1;
    	let div21;
    	let i1;
    	let t35;
    	let div22;
    	let h51;
    	let t37;
    	let p2;
    	let a1;
    	let t38;
    	let t39;
    	let li2;
    	let div23;
    	let i2;
    	let t40;
    	let div24;
    	let h52;
    	let t42;
    	let p3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div27 = element("div");
    			div26 = element("div");
    			div17 = element("div");
    			div16 = element("div");
    			h6 = element("h6");
    			h6.textContent = "Get in touch";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Our friendly team would love to hear from you.";
    			t3 = space();
    			form = element("form");
    			div15 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Name";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			div3 = element("div");
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Email";
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div5 = element("div");
    			div4 = element("div");
    			label2 = element("label");
    			label2.textContent = "Phone Number";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			div7 = element("div");
    			div6 = element("div");
    			label3 = element("label");
    			label3.textContent = "Select Service";
    			t14 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "--Please choose Services--";
    			option1 = element("option");
    			option1.textContent = "Website Development";
    			option2 = element("option");
    			option2.textContent = "Graphic Design";
    			option3 = element("option");
    			option3.textContent = "Digital Marketing";
    			t19 = space();
    			div9 = element("div");
    			div8 = element("div");
    			label4 = element("label");
    			label4.textContent = "Subject";
    			t21 = space();
    			input3 = element("input");
    			t22 = space();
    			div11 = element("div");
    			div10 = element("div");
    			label5 = element("label");
    			label5.textContent = "Message";
    			t24 = space();
    			textarea = element("textarea");
    			t25 = space();
    			div12 = element("div");
    			t26 = space();
    			div14 = element("div");
    			div13 = element("div");
    			button = element("button");
    			button.textContent = "Send Message";
    			t28 = space();
    			div25 = element("div");
    			div18 = element("div");
    			iframe = element("iframe");
    			t29 = space();
    			ul = element("ul");
    			li0 = element("li");
    			div19 = element("div");
    			i0 = element("i");
    			t30 = space();
    			div20 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Phone";
    			t32 = space();
    			p1 = element("p");
    			a0 = element("a");
    			t33 = text("+91 99425 02245");
    			t34 = space();
    			li1 = element("li");
    			div21 = element("div");
    			i1 = element("i");
    			t35 = space();
    			div22 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Mail";
    			t37 = space();
    			p2 = element("p");
    			a1 = element("a");
    			t38 = text(/*bot_email1*/ ctx[0]);
    			t39 = space();
    			li2 = element("li");
    			div23 = element("div");
    			i2 = element("i");
    			t40 = space();
    			div24 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Visit My Office";
    			t42 = space();
    			p3 = element("p");
    			p3.textContent = `${/*addressds*/ ctx[10]}`;
    			add_location(h6, file$a, 139, 12, 4556);
    			attr_dev(p0, "class", "lead");
    			add_location(p0, file$a, 140, 12, 4591);
    			attr_dev(label0, "class", "form-label");
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$a, 145, 20, 4851);
    			attr_dev(input0, "placeholder", "Name *");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "autocomplete", "off");
    			attr_dev(input0, "autocorrect", "off");
    			attr_dev(input0, "autocapitalize", "off");
    			attr_dev(input0, "spellcheck", "false");
    			add_location(input0, file$a, 146, 20, 4922);
    			attr_dev(div0, "class", "form-group");
    			add_location(div0, file$a, 144, 18, 4805);
    			attr_dev(div1, "class", "col-md-6");
    			add_location(div1, file$a, 143, 16, 4763);
    			attr_dev(label1, "class", "form-label");
    			attr_dev(label1, "for", "email");
    			add_location(label1, file$a, 151, 20, 5234);
    			attr_dev(input1, "placeholder", "Email *");
    			attr_dev(input1, "inputmode", "email");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "autocomplete", "off");
    			attr_dev(input1, "autocorrect", "off");
    			attr_dev(input1, "autocapitalize", "off");
    			attr_dev(input1, "spellcheck", "false");
    			add_location(input1, file$a, 152, 20, 5307);
    			attr_dev(div2, "class", "form-group");
    			add_location(div2, file$a, 150, 18, 5188);
    			attr_dev(div3, "class", "col-md-6");
    			add_location(div3, file$a, 149, 16, 5146);
    			attr_dev(label2, "class", "form-label");
    			attr_dev(label2, "for", "phone");
    			add_location(label2, file$a, 157, 20, 5640);
    			attr_dev(input2, "placeholder", "Phone Number *");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "type", "tel");
    			attr_dev(input2, "inputmode", "numeric");
    			attr_dev(input2, "autocomplete", "off");
    			attr_dev(input2, "autocorrect", "off");
    			attr_dev(input2, "autocapitalize", "off");
    			attr_dev(input2, "spellcheck", "false");
    			add_location(input2, file$a, 158, 20, 5720);
    			attr_dev(div4, "class", "form-group");
    			add_location(div4, file$a, 156, 18, 5594);
    			attr_dev(div5, "class", "col-md-6");
    			add_location(div5, file$a, 155, 16, 5552);
    			attr_dev(label3, "class", "form-label");
    			attr_dev(label3, "for", "service");
    			add_location(label3, file$a, 163, 20, 6060);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$a, 165, 22, 6316);
    			option1.__value = "Website Development";
    			option1.value = option1.__value;
    			add_location(option1, file$a, 166, 22, 6392);
    			option2.__value = "Graphic Design";
    			option2.value = option2.__value;
    			add_location(option2, file$a, 167, 22, 6480);
    			option3.__value = "Digital Marketing";
    			option3.value = option3.__value;
    			add_location(option3, file$a, 168, 22, 6558);
    			attr_dev(select, "class", "form-control");
    			attr_dev(select, "id", "service");
    			attr_dev(select, "autocomplete", "off");
    			attr_dev(select, "autocorrect", "off");
    			attr_dev(select, "autocapitalize", "off");
    			attr_dev(select, "spellcheck", "false");
    			if (/*selectedService*/ ctx[4] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[15].call(select));
    			add_location(select, file$a, 164, 20, 6144);
    			attr_dev(div6, "class", "form-group");
    			add_location(div6, file$a, 162, 18, 6014);
    			attr_dev(div7, "class", "col-md-6");
    			add_location(div7, file$a, 161, 16, 5972);
    			attr_dev(label4, "class", "form-label");
    			attr_dev(label4, "for", "subject");
    			add_location(label4, file$a, 174, 20, 6803);
    			attr_dev(input3, "placeholder", "Subject *");
    			attr_dev(input3, "class", "form-control");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "autocomplete", "off");
    			attr_dev(input3, "autocorrect", "off");
    			attr_dev(input3, "autocapitalize", "off");
    			attr_dev(input3, "spellcheck", "false");
    			add_location(input3, file$a, 175, 20, 6880);
    			attr_dev(div8, "class", "form-group");
    			add_location(div8, file$a, 173, 18, 6757);
    			attr_dev(div9, "class", "col-12");
    			add_location(div9, file$a, 172, 16, 6717);
    			attr_dev(label5, "class", "form-label");
    			attr_dev(label5, "for", "message");
    			add_location(label5, file$a, 180, 20, 7199);
    			attr_dev(textarea, "placeholder", "Your message *");
    			attr_dev(textarea, "rows", "4");
    			attr_dev(textarea, "class", "form-control");
    			attr_dev(textarea, "autocomplete", "off");
    			attr_dev(textarea, "autocorrect", "off");
    			attr_dev(textarea, "autocapitalize", "off");
    			attr_dev(textarea, "spellcheck", "false");
    			add_location(textarea, file$a, 181, 20, 7276);
    			attr_dev(div10, "class", "form-group");
    			add_location(div10, file$a, 179, 18, 7153);
    			attr_dev(div11, "class", "col-md-12");
    			add_location(div11, file$a, 178, 16, 7110);
    			attr_dev(div12, "class", "g-recaptcha");
    			attr_dev(div12, "data-sitekey", "6LffvikiAAAAAM0YMePlJ5Opyckwh-VvGCQQ24eM");
    			add_location(div12, file$a, 184, 16, 7522);
    			attr_dev(button, "class", "px-btn px-btn-theme2");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$a, 187, 20, 7710);
    			attr_dev(div13, "class", "send");
    			add_location(div13, file$a, 186, 18, 7670);
    			attr_dev(div14, "class", "col-md-12");
    			add_location(div14, file$a, 185, 16, 7627);
    			attr_dev(div15, "class", "row gx-3 gy-4");
    			add_location(div15, file$a, 142, 14, 4718);
    			add_location(form, file$a, 141, 12, 4671);
    			attr_dev(div16, "class", "contact-form");
    			add_location(div16, file$a, 138, 10, 4516);
    			attr_dev(div17, "class", "col-lg-6");
    			add_location(div17, file$a, 137, 8, 4482);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15676.776020866566!2d79.8326072!3d10.7964483!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a556c64ffffffff%3A0xb5436ef14c8555d3!2sBUMBLE%20BEES!5e0!3m2!1sen!2sin!4v1696772629044!5m2!1sen!2sin")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "width", "350");
    			attr_dev(iframe, "height", "400");
    			set_style(iframe, "border", "0");
    			iframe.allowFullscreen = "";
    			attr_dev(iframe, "loading", "lazy");
    			attr_dev(iframe, "referrerpolicy", "no-referrer-when-downgrade");
    			attr_dev(iframe, "title", "Bumble Bees Location on Google Maps");
    			add_location(iframe, file$a, 196, 12, 8002);
    			attr_dev(div18, "class", "pb-5");
    			add_location(div18, file$a, 195, 10, 7970);
    			attr_dev(i0, "class", "fas fa-envelope");
    			add_location(i0, file$a, 210, 16, 8691);
    			attr_dev(div19, "class", "icon bg-1");
    			add_location(div19, file$a, 209, 14, 8650);
    			add_location(h50, file$a, 213, 16, 8795);
    			attr_dev(a0, "href", /*phoneds*/ ctx[8]);
    			add_location(a0, file$a, 214, 19, 8830);
    			add_location(p1, file$a, 214, 16, 8827);
    			attr_dev(div20, "class", "col");
    			add_location(div20, file$a, 212, 14, 8760);
    			add_location(li0, file$a, 208, 12, 8630);
    			attr_dev(i1, "class", "fas fa-phone-alt");
    			add_location(i1, file$a, 219, 16, 8987);
    			attr_dev(div21, "class", "icon bg-2");
    			add_location(div21, file$a, 218, 14, 8946);
    			add_location(h51, file$a, 222, 16, 9092);
    			attr_dev(a1, "href", /*emailds*/ ctx[9]);
    			add_location(a1, file$a, 223, 19, 9126);
    			add_location(p2, file$a, 223, 16, 9123);
    			attr_dev(div22, "class", "col");
    			add_location(div22, file$a, 221, 14, 9057);
    			add_location(li1, file$a, 217, 12, 8926);
    			attr_dev(i2, "class", "fas fa-map-marker-alt");
    			add_location(i2, file$a, 228, 16, 9280);
    			attr_dev(div23, "class", "icon bg-3");
    			add_location(div23, file$a, 227, 14, 9239);
    			add_location(h52, file$a, 231, 16, 9390);
    			add_location(p3, file$a, 232, 16, 9432);
    			attr_dev(div24, "class", "col");
    			add_location(div24, file$a, 230, 14, 9355);
    			add_location(li2, file$a, 226, 12, 9219);
    			attr_dev(ul, "class", "contact-infos");
    			add_location(ul, file$a, 207, 10, 8590);
    			attr_dev(div25, "class", "col-lg-5 ms-auto col-xl-4");
    			add_location(div25, file$a, 194, 8, 7919);
    			attr_dev(div26, "class", "row gy-5");
    			add_location(div26, file$a, 136, 6, 4450);
    			attr_dev(div27, "class", "container");
    			add_location(div27, file$a, 135, 4, 4419);
    			attr_dev(section, "data-scroll-index", "4");
    			attr_dev(section, "id", "contactus");
    			attr_dev(section, "class", "section contactus-section bg-dark");
    			set_style(section, "background-image", "url(assets/img/effect/bg-effect-3.png)");
    			set_style(section, "background-repeat", "no-repeat");
    			set_style(section, "background-size", "cover");
    			set_style(section, "background-position", "center");
    			add_location(section, file$a, 134, 2, 4176);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div27);
    			append_dev(div27, div26);
    			append_dev(div26, div17);
    			append_dev(div17, div16);
    			append_dev(div16, h6);
    			append_dev(div16, t1);
    			append_dev(div16, p0);
    			append_dev(div16, t3);
    			append_dev(div16, form);
    			append_dev(form, div15);
    			append_dev(div15, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t5);
    			append_dev(div0, input0);
    			set_input_value(input0, /*name*/ ctx[1]);
    			append_dev(div15, t6);
    			append_dev(div15, div3);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t8);
    			append_dev(div2, input1);
    			set_input_value(input1, /*email*/ ctx[2]);
    			append_dev(div15, t9);
    			append_dev(div15, div5);
    			append_dev(div5, div4);
    			append_dev(div4, label2);
    			append_dev(div4, t11);
    			append_dev(div4, input2);
    			set_input_value(input2, /*phone*/ ctx[3]);
    			append_dev(div15, t12);
    			append_dev(div15, div7);
    			append_dev(div7, div6);
    			append_dev(div6, label3);
    			append_dev(div6, t14);
    			append_dev(div6, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			select_option(select, /*selectedService*/ ctx[4], true);
    			append_dev(div15, t19);
    			append_dev(div15, div9);
    			append_dev(div9, div8);
    			append_dev(div8, label4);
    			append_dev(div8, t21);
    			append_dev(div8, input3);
    			set_input_value(input3, /*subject*/ ctx[5]);
    			append_dev(div15, t22);
    			append_dev(div15, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label5);
    			append_dev(div10, t24);
    			append_dev(div10, textarea);
    			set_input_value(textarea, /*message*/ ctx[6]);
    			append_dev(div15, t25);
    			append_dev(div15, div12);
    			append_dev(div15, t26);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, button);
    			append_dev(div26, t28);
    			append_dev(div26, div25);
    			append_dev(div25, div18);
    			append_dev(div18, iframe);
    			append_dev(div25, t29);
    			append_dev(div25, ul);
    			append_dev(ul, li0);
    			append_dev(li0, div19);
    			append_dev(div19, i0);
    			append_dev(li0, t30);
    			append_dev(li0, div20);
    			append_dev(div20, h50);
    			append_dev(div20, t32);
    			append_dev(div20, p1);
    			append_dev(p1, a0);
    			append_dev(a0, t33);
    			append_dev(ul, t34);
    			append_dev(ul, li1);
    			append_dev(li1, div21);
    			append_dev(div21, i1);
    			append_dev(li1, t35);
    			append_dev(li1, div22);
    			append_dev(div22, h51);
    			append_dev(div22, t37);
    			append_dev(div22, p2);
    			append_dev(p2, a1);
    			append_dev(a1, t38);
    			append_dev(ul, t39);
    			append_dev(ul, li2);
    			append_dev(li2, div23);
    			append_dev(div23, i2);
    			append_dev(li2, t40);
    			append_dev(li2, div24);
    			append_dev(div24, h52);
    			append_dev(div24, t42);
    			append_dev(div24, p3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[14]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[15]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[16]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[17]),
    					listen_dev(form, "submit", /*handleSubmit*/ ctx[7], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2 && input0.value !== /*name*/ ctx[1]) {
    				set_input_value(input0, /*name*/ ctx[1]);
    			}

    			if (dirty & /*email*/ 4 && input1.value !== /*email*/ ctx[2]) {
    				set_input_value(input1, /*email*/ ctx[2]);
    			}

    			if (dirty & /*phone*/ 8) {
    				set_input_value(input2, /*phone*/ ctx[3]);
    			}

    			if (dirty & /*selectedService*/ 16) {
    				select_option(select, /*selectedService*/ ctx[4]);
    			}

    			if (dirty & /*subject*/ 32 && input3.value !== /*subject*/ ctx[5]) {
    				set_input_value(input3, /*subject*/ ctx[5]);
    			}

    			if (dirty & /*message*/ 64) {
    				set_input_value(textarea, /*message*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	let name = "";
    	let email = "";
    	let phone = "";
    	let selectedService = "";
    	let subject = "";
    	let message = "";

    	onMount(() => {
    		// Load reCAPTCHA widget script
    		const recaptchaScript = document.createElement("script");

    		recaptchaScript.src = "https://www.google.com/recaptcha/api.js";
    		recaptchaScript.async = true;
    		recaptchaScript.defer = true;
    		document.head.appendChild(recaptchaScript);
    	});

    	const handleSubmit = async event => {
    		event.preventDefault(); // Prevent the default form submission

    		// Verify reCAPTCHA
    		const recaptchaResponse = grecaptcha.getResponse();

    		if (!recaptchaResponse) {
    			// Show an error message to the user if reCAPTCHA is not verified
    			Swal.fire({
    				icon: 'error',
    				title: 'reCAPTCHA Verification Failed',
    				text: 'Please complete the reCAPTCHA verification to submit the form.',
    				timer: 6000,
    				showConfirmButton: true
    			});

    			return; // Exit the function if reCAPTCHA is not verified
    		}

    		// Proceed with form submission
    		// Firebase configuration (replace with your own config)
    		const firebaseConfig = {
    			apiKey: "AIzaSyDVVWLah77CZOVjBqBweWbuPJpnhrHVg_Y",
    			authDomain: "portfolio-4bf1c.firebaseapp.com",
    			databaseURL: "https://portfolio-4bf1c-default-rtdb.firebaseio.com",
    			projectId: "portfolio-4bf1c",
    			storageBucket: "portfolio-4bf1c.appspot.com",
    			messagingSenderId: "296534124626",
    			appId: "1:296534124626:web:133b828c2ecffa7d4f978b",
    			measurementId: "G-EQ2J4C5ZGP"
    		};

    		// Initialize Firebase
    		const firebaseApp = initializeApp(firebaseConfig);

    		const db = getDatabase(firebaseApp);
    		const dbRef = ref(db, "contactForms");

    		const formData = {
    			name,
    			email,
    			phone,
    			selectedService,
    			subject,
    			message,
    			timestamp: new Date().toString()
    		};

    		try {
    			await push(dbRef, formData);

    			// Send an email using Email.js
    			const emailData = {
    				name,
    				email,
    				phone,
    				selectedService,
    				subject,
    				message
    			};

    			const emailResponse = await emailjs.send("service_myfc0dj", "template_v8hsakk", emailData, "pJwMrOQHE7viiRAtn");
    			console.log("Email sent successfully:", emailResponse);

    			Swal.fire({
    				icon: 'success',
    				title: 'Message Sent successfully!',
    				text: `Your message to Raghavan has been sent successfully, ${name}!`,
    				timer: 5000,
    				showConfirmButton: true
    			});

    			// Clear the form fields after submission
    			$$invalidate(1, name = "");

    			$$invalidate(2, email = "");
    			$$invalidate(3, phone = "");
    			$$invalidate(4, selectedService = "");
    			$$invalidate(5, subject = "");
    			$$invalidate(6, message = "");
    		} catch(error) {
    			console.error("Error sending message:", error);

    			Swal.fire({
    				icon: 'error',
    				title: `${name} Oops! Something went wrong`,
    				text: `Please reach out to Raghavan at +91 99425 02245 for a helping hand! 😊`,
    				timer: 6000,
    				showConfirmButton: true
    			});
    		}
    	};

    	const bot_email1 = "sayhello" + String.fromCharCode(64) + "jsraghavan.me";
    	const bot_email2 = "raghavanofficials" + String.fromCharCode(64) + "gmail.com";
    	let phoneds = "tel:+919942502245";
    	let emailds = `mailto:${bot_email1}?cc=${bot_email2}&bcc=contact.archanaraghvan@gmail.com&subject=Hi%20!%20%7C%20Enquire%20Mail%20Form%20Raghvan%20Portfolio%20Website`;
    	let addressds = "183/2 Dhermer Street Collector Office Post, Nagapattinam - Tamil nadu";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		name = this.value;
    		$$invalidate(1, name);
    	}

    	function input1_input_handler() {
    		email = this.value;
    		$$invalidate(2, email);
    	}

    	function input2_input_handler() {
    		phone = this.value;
    		$$invalidate(3, phone);
    	}

    	function select_change_handler() {
    		selectedService = select_value(this);
    		$$invalidate(4, selectedService);
    	}

    	function input3_input_handler() {
    		subject = this.value;
    		$$invalidate(5, subject);
    	}

    	function textarea_input_handler() {
    		message = this.value;
    		$$invalidate(6, message);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		initializeApp,
    		getDatabase,
    		ref,
    		push,
    		emailjs,
    		Swal,
    		name,
    		email,
    		phone,
    		selectedService,
    		subject,
    		message,
    		handleSubmit,
    		bot_email1,
    		bot_email2,
    		phoneds,
    		emailds,
    		addressds
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    		if ('phone' in $$props) $$invalidate(3, phone = $$props.phone);
    		if ('selectedService' in $$props) $$invalidate(4, selectedService = $$props.selectedService);
    		if ('subject' in $$props) $$invalidate(5, subject = $$props.subject);
    		if ('message' in $$props) $$invalidate(6, message = $$props.message);
    		if ('phoneds' in $$props) $$invalidate(8, phoneds = $$props.phoneds);
    		if ('emailds' in $$props) $$invalidate(9, emailds = $$props.emailds);
    		if ('addressds' in $$props) $$invalidate(10, addressds = $$props.addressds);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		bot_email1,
    		name,
    		email,
    		phone,
    		selectedService,
    		subject,
    		message,
    		handleSubmit,
    		phoneds,
    		emailds,
    		addressds,
    		bot_email2,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		select_change_handler,
    		input3_input_handler,
    		textarea_input_handler
    	];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, { bot_email1: 0, bot_email2: 11 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get bot_email1() {
    		return this.$$.ctx[0];
    	}

    	set bot_email1(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bot_email2() {
    		return this.$$.ctx[11];
    	}

    	set bot_email2(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Cta.svelte generated by Svelte v3.59.2 */

    const file$9 = "src\\Components\\Cta.svelte";

    function create_fragment$9(ctx) {
    	let section;
    	let div3;
    	let div2;
    	let div0;
    	let h4;
    	let t1;
    	let div1;
    	let a;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Interested in working with me?";
    			t1 = space();
    			div1 = element("div");
    			a = element("a");
    			a.textContent = "Contact Now";
    			attr_dev(h4, "class", "h1 m-0 text-white");
    			add_location(h4, file$9, 9, 18, 223);
    			attr_dev(div0, "class", "col-lg-8 col-md-7 text-center text-md-start");
    			add_location(div0, file$9, 8, 14, 146);
    			attr_dev(a, "class", "px-btn px-btn-theme2");
    			attr_dev(a, "data-scroll-nav", "4");
    			attr_dev(a, "href", "#contactus");
    			add_location(a, file$9, 12, 18, 401);
    			attr_dev(div1, "class", "col-lg-4 col-md-5 text-center text-md-end");
    			add_location(div1, file$9, 11, 14, 326);
    			attr_dev(div2, "class", "row gy-3");
    			add_location(div2, file$9, 7, 10, 108);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$9, 6, 6, 73);
    			attr_dev(section, "class", "py-5 bg-dark");
    			add_location(section, file$9, 5, 2, 35);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h4);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, a);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cta', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cta> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Cta extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cta",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\Components\Header.svelte generated by Svelte v3.59.2 */

    const file$8 = "src\\Components\\Header.svelte";

    function create_fragment$8(ctx) {
    	let header;
    	let nav;
    	let div3;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let button;
    	let span0;
    	let t1;
    	let span1;
    	let t2;
    	let span2;
    	let t3;
    	let div0;
    	let ul;
    	let li0;
    	let a1;
    	let span3;
    	let t5;
    	let li1;
    	let a2;
    	let span4;
    	let t7;
    	let li2;
    	let a3;
    	let span5;
    	let t9;
    	let li3;
    	let a4;
    	let span6;
    	let t11;
    	let li4;
    	let a5;
    	let span7;
    	let t13;
    	let li5;
    	let a6;
    	let t14_value = /*menuData*/ ctx[1][5] + "";
    	let t14;
    	let span8;
    	let t15;
    	let div2;
    	let div1;
    	let a7;
    	let p;
    	let t17;
    	let img1;
    	let img1_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			nav = element("nav");
    			div3 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			button = element("button");
    			span0 = element("span");
    			t1 = space();
    			span1 = element("span");
    			t2 = space();
    			span2 = element("span");
    			t3 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			span3 = element("span");
    			span3.textContent = `${/*menuData*/ ctx[1][0]}`;
    			t5 = space();
    			li1 = element("li");
    			a2 = element("a");
    			span4 = element("span");
    			span4.textContent = `${/*menuData*/ ctx[1][1]}`;
    			t7 = space();
    			li2 = element("li");
    			a3 = element("a");
    			span5 = element("span");
    			span5.textContent = `${/*menuData*/ ctx[1][2]}`;
    			t9 = space();
    			li3 = element("li");
    			a4 = element("a");
    			span6 = element("span");
    			span6.textContent = `${/*menuData*/ ctx[1][3]}`;
    			t11 = space();
    			li4 = element("li");
    			a5 = element("a");
    			span7 = element("span");
    			span7.textContent = `${/*menuData*/ ctx[1][4]}`;
    			t13 = space();
    			li5 = element("li");
    			a6 = element("a");
    			t14 = text(t14_value);
    			span8 = element("span");
    			t15 = space();
    			div2 = element("div");
    			div1 = element("div");
    			a7 = element("a");
    			p = element("p");
    			p.textContent = "Powered by";
    			t17 = space();
    			img1 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = /*portfolioLogo*/ ctx[0].logo_src)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", /*portfolioLogo*/ ctx[0].logo_class);
    			attr_dev(img0, "title", "");
    			attr_dev(img0, "alt", "");
    			add_location(img0, file$8, 22, 16, 575);
    			attr_dev(a0, "class", "navbar-brand");
    			attr_dev(a0, "href", "/");
    			add_location(a0, file$8, 21, 12, 524);
    			add_location(span0, file$8, 27, 16, 972);
    			add_location(span1, file$8, 28, 16, 1003);
    			add_location(span2, file$8, 29, 16, 1034);
    			attr_dev(button, "class", "navbar-toggler");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-bs-toggle", "collapse");
    			attr_dev(button, "data-bs-target", "#navbar-collapse-toggle");
    			attr_dev(button, "aria-controls", "navbar-collapse-toggle");
    			attr_dev(button, "aria-expanded", "false");
    			attr_dev(button, "aria-label", "Toggle navigation");
    			add_location(button, file$8, 26, 12, 750);
    			add_location(span3, file$8, 35, 77, 1353);
    			attr_dev(a1, "class", "nav-link");
    			attr_dev(a1, "data-scroll-nav", "0");
    			attr_dev(a1, "href", "#home");
    			add_location(a1, file$8, 35, 24, 1300);
    			add_location(li0, file$8, 35, 20, 1296);
    			add_location(span4, file$8, 36, 81, 1471);
    			attr_dev(a2, "class", "nav-link");
    			attr_dev(a2, "data-scroll-nav", "1");
    			attr_dev(a2, "href", "#services");
    			add_location(a2, file$8, 36, 24, 1414);
    			add_location(li1, file$8, 36, 20, 1410);
    			add_location(span5, file$8, 37, 78, 1586);
    			attr_dev(a3, "class", "nav-link");
    			attr_dev(a3, "data-scroll-nav", "2");
    			attr_dev(a3, "href", "#skill");
    			add_location(a3, file$8, 37, 24, 1532);
    			add_location(li2, file$8, 37, 20, 1528);
    			add_location(span6, file$8, 38, 77, 1700);
    			attr_dev(a4, "class", "nav-link");
    			attr_dev(a4, "data-scroll-nav", "3");
    			attr_dev(a4, "href", "#work");
    			add_location(a4, file$8, 38, 24, 1647);
    			add_location(li3, file$8, 38, 20, 1643);
    			add_location(span7, file$8, 39, 57, 1794);
    			attr_dev(a5, "class", "nav-link");
    			attr_dev(a5, "href", "/blog");
    			add_location(a5, file$8, 39, 24, 1761);
    			add_location(li4, file$8, 39, 20, 1757);
    			add_location(span8, file$8, 40, 95, 1926);
    			attr_dev(a6, "class", "nav-link");
    			attr_dev(a6, "data-scroll-nav", "4");
    			attr_dev(a6, "href", "#contactus");
    			add_location(a6, file$8, 40, 24, 1855);
    			add_location(li5, file$8, 40, 20, 1851);
    			attr_dev(ul, "class", "navbar-nav mx-auto");
    			add_location(ul, file$8, 34, 16, 1243);
    			attr_dev(div0, "class", "collapse navbar-collapse justify-content-end");
    			attr_dev(div0, "id", "navbar-collapse-toggle");
    			add_location(div0, file$8, 33, 12, 1139);
    			attr_dev(p, "class", "mb-2 mb-lg-0");
    			add_location(p, file$8, 48, 24, 2225);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/img/Bumble Bees.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Bumble Bees It Solution");
    			add_location(img1, file$8, 49, 24, 2290);
    			attr_dev(a7, "href", "https://bumblebees.co.in/");
    			add_location(a7, file$8, 47, 20, 2163);
    			attr_dev(div1, "class", "powered-by");
    			add_location(div1, file$8, 46, 16, 2117);
    			attr_dev(div2, "class", "ms-auto d-none d-lg-block");
    			add_location(div2, file$8, 45, 12, 2060);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$8, 18, 8, 457);
    			attr_dev(nav, "class", "navbar header-nav navbar-expand-lg one-page-nav");
    			add_location(nav, file$8, 17, 4, 386);
    			attr_dev(header, "class", "main-header");
    			add_location(header, file$8, 16, 0, 352);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, nav);
    			append_dev(nav, div3);
    			append_dev(div3, a0);
    			append_dev(a0, img0);
    			append_dev(div3, t0);
    			append_dev(div3, button);
    			append_dev(button, span0);
    			append_dev(button, t1);
    			append_dev(button, span1);
    			append_dev(button, t2);
    			append_dev(button, span2);
    			append_dev(div3, t3);
    			append_dev(div3, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(a1, span3);
    			append_dev(ul, t5);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(a2, span4);
    			append_dev(ul, t7);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(a3, span5);
    			append_dev(ul, t9);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(a4, span6);
    			append_dev(ul, t11);
    			append_dev(ul, li4);
    			append_dev(li4, a5);
    			append_dev(a5, span7);
    			append_dev(ul, t13);
    			append_dev(ul, li5);
    			append_dev(li5, a6);
    			append_dev(a6, t14);
    			append_dev(a6, span8);
    			append_dev(div3, t15);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, a7);
    			append_dev(a7, p);
    			append_dev(a7, t17);
    			append_dev(a7, img1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);

    	let portfolioLogo = {
    		logo_src: './assets/img/logo.svg',
    		logo_title: 'Raghavan',
    		logo_alt: 'Raghavan Portfolio',
    		logo_class: "brand-img"
    	};

    	let menuData = ['Home', 'Services', 'Skills', 'Portfolio', 'Blog', 'Contact'];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ portfolioLogo, menuData });

    	$$self.$inject_state = $$props => {
    		if ('portfolioLogo' in $$props) $$invalidate(0, portfolioLogo = $$props.portfolioLogo);
    		if ('menuData' in $$props) $$invalidate(1, menuData = $$props.menuData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [portfolioLogo, menuData];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Components\Home.svelte generated by Svelte v3.59.2 */

    const file$7 = "src\\Components\\Home.svelte";

    function create_fragment$7(ctx) {
    	let section;
    	let div6;
    	let div5;
    	let div2;
    	let div1;
    	let h1;
    	let t0;
    	let t1;
    	let span;
    	let t2;
    	let t3;
    	let p;
    	let t4;
    	let t5;
    	let t6;
    	let div0;
    	let a;
    	let t8;
    	let div4;
    	let div3;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div6 = element("div");
    			div5 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text(/*greetings*/ ctx[1]);
    			t1 = space();
    			span = element("span");
    			t2 = text(/*name*/ ctx[0]);
    			t3 = space();
    			p = element("p");
    			t4 = text("Unlocking Innovation and Fun in the Tech World with ");
    			t5 = text(/*name*/ ctx[0]);
    			t6 = space();
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "Let's Start";
    			t8 = space();
    			div4 = element("div");
    			div3 = element("div");
    			img = element("img");
    			add_location(span, file$7, 26, 36, 654);
    			add_location(h1, file$7, 26, 20, 638);
    			add_location(p, file$7, 27, 20, 700);
    			attr_dev(a, "class", "px-btn px-btn-theme");
    			attr_dev(a, "href", "/");
    			add_location(a, file$7, 29, 24, 834);
    			attr_dev(div0, "class", "btn-bar");
    			add_location(div0, file$7, 28, 20, 787);
    			attr_dev(div1, "class", "home-intro one-page-nav text-center text-lg-start");
    			add_location(div1, file$7, 22, 16, 468);
    			attr_dev(div2, "class", "col-lg-6");
    			add_location(div2, file$7, 21, 12, 428);
    			if (!src_url_equal(img.src, img_src_value = /*welcomeImage*/ ctx[2].logo_src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "title", /*welcomeImage*/ ctx[2].logo_title);
    			attr_dev(img, "alt", /*welcomeImage*/ ctx[2].logo_alt);
    			add_location(img, file$7, 35, 20, 1086);
    			attr_dev(div3, "class", "home-image text-center");
    			add_location(div3, file$7, 34, 16, 1028);
    			attr_dev(div4, "class", "col-lg-6 pt-4 pt-lg-0");
    			add_location(div4, file$7, 33, 12, 975);
    			attr_dev(div5, "class", "row gy-5 align-items-center");
    			add_location(div5, file$7, 20, 8, 373);
    			attr_dev(div6, "class", "container");
    			add_location(div6, file$7, 19, 4, 340);
    			attr_dev(section, "data-scroll-index", "0");
    			attr_dev(section, "class", "home-section bg-gray");
    			add_location(section, file$7, 18, 0, 274);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, span);
    			append_dev(span, t2);
    			append_dev(div1, t3);
    			append_dev(div1, p);
    			append_dev(p, t4);
    			append_dev(p, t5);
    			append_dev(div1, t6);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
    			if (dirty & /*name*/ 1) set_data_dev(t5, /*name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let greetings = "Hello 👋 I'am";
    	let { name } = $$props;

    	let welcomeImage = {
    		logo_src: './assets/img/Hello-rafiki.svg',
    		logo_title: 'Welcome Home',
    		logo_alt: 'Raghavan Welcome Home'
    	};

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console.warn("<Home> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ greetings, name, welcomeImage });

    	$$self.$inject_state = $$props => {
    		if ('greetings' in $$props) $$invalidate(1, greetings = $$props.greetings);
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('welcomeImage' in $$props) $$invalidate(2, welcomeImage = $$props.welcomeImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, greetings, welcomeImage];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get name() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Components\Project.svelte generated by Svelte v3.59.2 */

    const file$6 = "src\\Components\\Project.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (45:8) {#each projects as project, index}
    function create_each_block$3(ctx) {
    	let div5;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let a0;
    	let i;
    	let t1;
    	let div4;
    	let div3;
    	let h6;
    	let span;
    	let t2_value = /*project*/ ctx[1].category + "";
    	let t2;
    	let t3;
    	let h4;
    	let t4_value = /*project*/ ctx[1].title + "";
    	let t4;
    	let t5;
    	let p;
    	let t6_value = /*project*/ ctx[1].description + "";
    	let t6;
    	let t7;
    	let div2;
    	let a1;
    	let t8;
    	let t9;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			a0 = element("a");
    			i = element("i");
    			t1 = space();
    			div4 = element("div");
    			div3 = element("div");
    			h6 = element("h6");
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			h4 = element("h4");
    			t4 = text(t4_value);
    			t5 = space();
    			p = element("p");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			a1 = element("a");
    			t8 = text("View Project");
    			t9 = space();
    			if (!src_url_equal(img.src, img_src_value = /*project*/ ctx[1].imgSrc)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "title", "");
    			attr_dev(img, "alt", "");
    			add_location(img, file$6, 48, 16, 2125);
    			attr_dev(i, "class", "fas fa-arrow-right");
    			add_location(i, file$6, 50, 18, 2269);
    			attr_dev(a0, "href", /*project*/ ctx[1].imgSrc);
    			attr_dev(a0, "class", "gallery-link gallery-link-icon");
    			add_location(a0, file$6, 49, 16, 2185);
    			attr_dev(div0, "class", "portfolio-img");
    			add_location(div0, file$6, 47, 14, 2080);
    			attr_dev(div1, "class", "col-md-6 col-lg-5");
    			add_location(div1, file$6, 46, 12, 2033);
    			add_location(span, file$6, 56, 20, 2478);
    			add_location(h6, file$6, 56, 16, 2474);
    			add_location(h4, file$6, 57, 16, 2532);
    			add_location(p, file$6, 58, 16, 2574);
    			attr_dev(a1, "class", "px-btn px-btn-theme");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", /*project*/ ctx[1].project_link);
    			add_location(a1, file$6, 60, 18, 2661);
    			attr_dev(div2, "class", "btn-bar");
    			add_location(div2, file$6, 59, 16, 2620);
    			attr_dev(div3, "class", "portfolio-text");
    			add_location(div3, file$6, 55, 14, 2428);
    			attr_dev(div4, "class", "col-md-6 col-lg-5");
    			add_location(div4, file$6, 54, 12, 2381);
    			attr_dev(div5, "class", "row gx-3 pb-3 mb-5 pb-lg-3 mb-lg-3 gy-4 portfolio-box justify-content-around align-items-center");
    			attr_dev(div5, "key", /*index*/ ctx[3]);
    			add_location(div5, file$6, 45, 10, 1897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, a0);
    			append_dev(a0, i);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, h6);
    			append_dev(h6, span);
    			append_dev(span, t2);
    			append_dev(div3, t3);
    			append_dev(div3, h4);
    			append_dev(h4, t4);
    			append_dev(div3, t5);
    			append_dev(div3, p);
    			append_dev(p, t6);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, a1);
    			append_dev(a1, t8);
    			append_dev(div5, t9);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(45:8) {#each projects as project, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let section;
    	let div3;
    	let div1;
    	let div0;
    	let h3;
    	let span;
    	let t1;
    	let div2;
    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			span = element("span");
    			span.textContent = "Latest Projects";
    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(span, file$6, 40, 14, 1726);
    			add_location(h3, file$6, 40, 10, 1722);
    			attr_dev(div0, "class", "col-lg-6 text-center");
    			add_location(div0, file$6, 39, 8, 1676);
    			attr_dev(div1, "class", "row section-heading justify-content-center");
    			add_location(div1, file$6, 38, 6, 1610);
    			attr_dev(div2, "class", "lightbox-gallery portfolio-box");
    			add_location(div2, file$6, 43, 6, 1797);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$6, 37, 4, 1579);
    			attr_dev(section, "data-scroll-index", "3");
    			attr_dev(section, "class", "section work-section bg-gray");
    			add_location(section, file$6, 36, 2, 1505);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, span);
    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);

    	let projects = [
    		{
    			imgSrc: "assets/img/project1.jpg",
    			title: "Website Design for EGSPJ International School",
    			category: "Web Design",
    			description: "Crafting visually stunning and user-friendly website design for EGSPJ International School.",
    			project_link: "https://egspschools.com/"
    		},
    		{
    			imgSrc: "assets/img/project2.jpg",
    			title: "Website Design for Adhitya Builders",
    			category: "Web Design",
    			description: "Crafting captivating online experiences for Adhitya Builders, Nagapattinams leading construction company, by me.",
    			project_link: "https://adhityabuilders.netlify.app/"
    		},
    		{
    			imgSrc: "assets/img/project3.jpg",
    			title: "Website Design for Waggy Tails Pet Care Clinic",
    			category: "Web Design",
    			description: "Crafting an intuitive and appealing website design for Waggy Tails Pet Care Clinic to enhance user experience and showcase their exceptional pet care services.",
    			project_link: "https://waggytailspetclinic.com/"
    		},
    		{
    			imgSrc: "assets/img/project5.jpg",
    			title: "Website Design for Vanshavali Foundation",
    			category: "Web Design",
    			description: "I created a visually captivating and user-friendly website design for Vanshavali Foundation.",
    			project_link: "https://vanshavalifoundations.com/"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ projects });

    	$$self.$inject_state = $$props => {
    		if ('projects' in $$props) $$invalidate(0, projects = $$props.projects);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [projects];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\Components\Raghavan.svelte generated by Svelte v3.59.2 */

    const file$5 = "src\\Components\\Raghavan.svelte";

    function create_fragment$5(ctx) {
    	let section;
    	let div8;
    	let div7;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div6;
    	let div5;
    	let h3;
    	let t2;
    	let p;
    	let t4;
    	let div3;
    	let div1;
    	let h50;
    	let t6;
    	let span0;
    	let t8;
    	let div2;
    	let h51;
    	let t10;
    	let span1;
    	let t12;
    	let div4;
    	let a0;
    	let t14;
    	let a1;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div8 = element("div");
    			div7 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div6 = element("div");
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "I'm a Entrepreneur & Business Strategist with over 4 years of experience.";
    			t2 = space();
    			p = element("p");
    			p.textContent = `${/*aboutMessage*/ ctx[0]}`;
    			t4 = space();
    			div3 = element("div");
    			div1 = element("div");
    			h50 = element("h5");
    			h50.textContent = "35+";
    			t6 = space();
    			span0 = element("span");
    			span0.textContent = "Projet Completed";
    			t8 = space();
    			div2 = element("div");
    			h51 = element("h5");
    			h51.textContent = "40+";
    			t10 = space();
    			span1 = element("span");
    			span1.textContent = "Happy Clients";
    			t12 = space();
    			div4 = element("div");
    			a0 = element("a");
    			a0.textContent = "Contact Me";
    			t14 = space();
    			a1 = element("a");
    			a1.textContent = "Portfolio";
    			if (!src_url_equal(img.src, img_src_value = /*aboutImage*/ ctx[1].logo_src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "title", /*aboutImage*/ ctx[1].logo_title);
    			attr_dev(img, "alt", /*aboutImage*/ ctx[1].logo_alt);
    			add_location(img, file$5, 18, 16, 765);
    			attr_dev(div0, "class", "col-lg-6 text-center");
    			add_location(div0, file$5, 17, 12, 713);
    			attr_dev(h3, "class", "h1");
    			add_location(h3, file$5, 22, 20, 980);
    			add_location(p, file$5, 23, 20, 1095);
    			add_location(h50, file$5, 26, 28, 1244);
    			add_location(span0, file$5, 27, 28, 1286);
    			attr_dev(div1, "class", "col-6 col-md-4");
    			add_location(div1, file$5, 25, 24, 1186);
    			add_location(h51, file$5, 30, 28, 1431);
    			add_location(span1, file$5, 31, 28, 1473);
    			attr_dev(div2, "class", "col-6 col-md-4");
    			add_location(div2, file$5, 29, 24, 1373);
    			attr_dev(div3, "class", "row pt-2");
    			add_location(div3, file$5, 24, 20, 1138);
    			attr_dev(a0, "class", "px-btn px-btn-theme me-4");
    			attr_dev(a0, "href", "#contactus");
    			add_location(a0, file$5, 35, 24, 1633);
    			attr_dev(a1, "class", "px-btn px-btn-dark");
    			attr_dev(a1, "href", "#work");
    			add_location(a1, file$5, 36, 24, 1727);
    			attr_dev(div4, "class", "btn-bar pt-4");
    			add_location(div4, file$5, 34, 20, 1581);
    			attr_dev(div5, "class", "about-text");
    			add_location(div5, file$5, 21, 16, 934);
    			attr_dev(div6, "class", "col-lg-6 ps-lg-5");
    			add_location(div6, file$5, 20, 12, 886);
    			attr_dev(div7, "class", "row gy-5 align-items-center");
    			add_location(div7, file$5, 16, 8, 658);
    			attr_dev(div8, "class", "container");
    			add_location(div8, file$5, 15, 4, 625);
    			attr_dev(section, "class", "section about-section");
    			add_location(section, file$5, 14, 0, 580);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div0);
    			append_dev(div0, img);
    			append_dev(div7, t0);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h3);
    			append_dev(div5, t2);
    			append_dev(div5, p);
    			append_dev(div5, t4);
    			append_dev(div5, div3);
    			append_dev(div3, div1);
    			append_dev(div1, h50);
    			append_dev(div1, t6);
    			append_dev(div1, span0);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, h51);
    			append_dev(div2, t10);
    			append_dev(div2, span1);
    			append_dev(div5, t12);
    			append_dev(div5, div4);
    			append_dev(div4, a0);
    			append_dev(div4, t14);
    			append_dev(div4, a1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Raghavan', slots, []);
    	let aboutMessage = 'Raghavan, a tech enthusiast and entrepreneur, possesses an exceptional work ethic and a keen eye for spotting opportunities even in challenging situations. His unique blend of tech expertise, creative flair, and a dash of fun makes him a formidable presence in any industry. Connect with Raghavan to experience this exciting mix firsthand.';

    	let aboutImage = {
    		logo_src: './assets/img/aboutme-banner1.png',
    		logo_title: 'About Raghavan',
    		logo_alt: 'Raghavan About Img'
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Raghavan> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ aboutMessage, aboutImage });

    	$$self.$inject_state = $$props => {
    		if ('aboutMessage' in $$props) $$invalidate(0, aboutMessage = $$props.aboutMessage);
    		if ('aboutImage' in $$props) $$invalidate(1, aboutImage = $$props.aboutImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [aboutMessage, aboutImage];
    }

    class Raghavan extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Raghavan",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\Components\Services.svelte generated by Svelte v3.59.2 */

    const file$4 = "src\\Components\\Services.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    // (41:14) {#each services as service, index}
    function create_each_block$2(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let i;
    	let t0;
    	let div1;
    	let h5;
    	let t1_value = /*service*/ ctx[1].title + "";
    	let t1;
    	let t2;
    	let p;
    	let t3_value = /*service*/ ctx[1].description + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			h5 = element("h5");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(i, "class", "bi " + /*service*/ ctx[1].icon);
    			add_location(i, file$4, 43, 44, 1690);
    			attr_dev(div0, "class", "icon");
    			add_location(div0, file$4, 43, 26, 1672);
    			add_location(h5, file$4, 45, 30, 1818);
    			add_location(p, file$4, 46, 30, 1874);
    			attr_dev(div1, "class", "feature-content");
    			add_location(div1, file$4, 44, 26, 1757);
    			attr_dev(div2, "class", "feature-box-01 " + /*service*/ ctx[1].bgColor);
    			add_location(div2, file$4, 42, 22, 1598);
    			attr_dev(div3, "class", "col-md-6");
    			attr_dev(div3, "key", /*index*/ ctx[3]);
    			add_location(div3, file$4, 41, 18, 1540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, i);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h5);
    			append_dev(h5, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div3, t4);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(41:14) {#each services as service, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let div3;
    	let div1;
    	let div0;
    	let h3;
    	let span;
    	let t1;
    	let div2;
    	let each_value = /*services*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			span = element("span");
    			span.textContent = "My Services";
    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(span, file$4, 36, 22, 1367);
    			add_location(h3, file$4, 36, 18, 1363);
    			attr_dev(div0, "class", "col-lg-6 text-center");
    			add_location(div0, file$4, 35, 14, 1309);
    			attr_dev(div1, "class", "row section-heading justify-content-center");
    			add_location(div1, file$4, 34, 10, 1237);
    			attr_dev(div2, "class", "row gy-4");
    			add_location(div2, file$4, 39, 10, 1448);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$4, 33, 6, 1202);
    			attr_dev(section, "data-scroll-index", "1");
    			attr_dev(section, "class", "section services-section bg-gray");
    			set_style(section, "background-image", "url(assets/img/effect/bg-effect-1.png)");
    			set_style(section, "background-repeat", "no-repeat");
    			set_style(section, "background-size", "cover");
    			add_location(section, file$4, 32, 2, 1002);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, span);
    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div2, null);
    				}
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*services*/ 1) {
    				each_value = /*services*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Services', slots, []);

    	let services = [
    		{
    			icon: 'bi-globe',
    			bgColor: 'bg-1',
    			title: 'Web Design',
    			description: 'Delivering top-notch web design services that turn ideas into stunning digital experiences.'
    		},
    		{
    			icon: 'bi-brush',
    			bgColor: 'bg-2',
    			title: 'Graphic Design',
    			description: 'Unlocking creativity through captivating visuals, I offer the finest Graphic Design services for your brands visual identity.'
    		},
    		{
    			icon: 'bi-palette2',
    			bgColor: 'bg-3',
    			title: 'UX / UI Design',
    			description: 'Elevate your digital experience with stunning UX/UI designs tailored to your needs.'
    		},
    		{
    			icon: 'bi-graph-up',
    			bgColor: 'bg-4',
    			title: 'Business Consulting',
    			description: 'Unlocking growth and success through my strategic business consulting.'
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Services> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ services });

    	$$self.$inject_state = $$props => {
    		if ('services' in $$props) $$invalidate(0, services = $$props.services);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [services];
    }

    class Services extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Services",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\Components\Skills.svelte generated by Svelte v3.59.2 */

    const file$3 = "src\\Components\\Skills.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (31:26) {#each skills as skill, index}
    function create_each_block$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let i;
    	let t0;
    	let h6;
    	let t1_value = /*skill*/ ctx[2].skillName + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			h6 = element("h6");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", /*skill*/ ctx[2].iconClass);
    			add_location(i, file$3, 34, 42, 1468);
    			attr_dev(div0, "class", "icon");
    			add_location(div0, file$3, 33, 38, 1406);
    			add_location(h6, file$3, 36, 38, 1587);
    			attr_dev(div1, "class", "feature-box-02 " + /*skill*/ ctx[2].bgColor);
    			add_location(div1, file$3, 32, 34, 1322);
    			attr_dev(div2, "class", "col-6 col-md-4 col-lg-6");
    			attr_dev(div2, "key", /*index*/ ctx[4]);
    			add_location(div2, file$3, 31, 30, 1237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, i);
    			append_dev(div1, t0);
    			append_dev(div1, h6);
    			append_dev(h6, t1);
    			append_dev(div2, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(31:26) {#each skills as skill, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let div6;
    	let div5;
    	let div3;
    	let div0;
    	let h3;
    	let span;
    	let t1;
    	let div2;
    	let div1;
    	let t2;
    	let div4;
    	let img;
    	let img_src_value;
    	let each_value = /*skills*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div6 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			span = element("span");
    			span.textContent = "My Skills";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div4 = element("div");
    			img = element("img");
    			add_location(span, file$3, 26, 38, 1006);
    			attr_dev(h3, "class", "m-0");
    			add_location(h3, file$3, 26, 22, 990);
    			attr_dev(div0, "class", "section-heading");
    			add_location(div0, file$3, 25, 18, 937);
    			attr_dev(div1, "class", "row g-3");
    			add_location(div1, file$3, 29, 22, 1126);
    			attr_dev(div2, "class", "skill-box");
    			add_location(div2, file$3, 28, 18, 1079);
    			attr_dev(div3, "class", "col-lg-6");
    			add_location(div3, file$3, 24, 14, 895);
    			if (!src_url_equal(img.src, img_src_value = /*skillImg*/ ctx[1]["logo_src"])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "title", /*skillImg*/ ctx[1]["logo_title"]);
    			attr_dev(img, "alt", /*skillImg*/ ctx[1]["logo_alt"]);
    			add_location(img, file$3, 44, 18, 1876);
    			attr_dev(div4, "class", "col-lg-6 text-center");
    			add_location(div4, file$3, 43, 14, 1822);
    			attr_dev(div5, "class", "row gy-5");
    			add_location(div5, file$3, 23, 10, 857);
    			attr_dev(div6, "class", "container");
    			add_location(div6, file$3, 22, 6, 822);
    			attr_dev(section, "data-scroll-index", "2");
    			attr_dev(section, "class", "section experience-section pb-0");
    			add_location(section, file$3, 21, 2, 743);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h3);
    			append_dev(h3, span);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			append_dev(div5, t2);
    			append_dev(div5, div4);
    			append_dev(div4, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*skills*/ 1) {
    				each_value = /*skills*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);

    	let skills = [
    		{
    			iconClass: 'fab fa-html5',
    			bgColor: 'bg-1',
    			skillName: 'HTML'
    		},
    		{
    			iconClass: 'fab fa-css3',
    			bgColor: 'bg-2',
    			skillName: 'CSS'
    		},
    		{
    			iconClass: 'fab fa-js',
    			bgColor: 'bg-3',
    			skillName: 'Javascript'
    		},
    		{
    			iconClass: 'fab fa-figma',
    			bgColor: 'bg-4',
    			skillName: 'Figma'
    		},
    		{
    			iconClass: 'bi bi-palette',
    			bgColor: 'bg-5',
    			skillName: 'Adobe Photoshop / illustrator '
    		},
    		{
    			iconClass: 'fab fa-aws',
    			bgColor: 'bg-6',
    			skillName: 'AWS'
    		}
    	];

    	let skillImg = {
    		logo_src: './assets/img/Programming-cuate.svg',
    		logo_title: 'My Skills Raghavan',
    		logo_alt: 'Raghavan Skills'
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ skills, skillImg });

    	$$self.$inject_state = $$props => {
    		if ('skills' in $$props) $$invalidate(0, skills = $$props.skills);
    		if ('skillImg' in $$props) $$invalidate(1, skillImg = $$props.skillImg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [skills, skillImg];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\Components\Footer.svelte generated by Svelte v3.59.2 */

    const file$2 = "src\\Components\\Footer.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (21:12) {#each socialMediaLinks as link}
    function create_each_block(ctx) {
    	let a;
    	let i;

    	const block = {
    		c: function create() {
    			a = element("a");
    			i = element("i");
    			attr_dev(i, "class", /*link*/ ctx[2].iconClass);
    			add_location(i, file$2, 21, 34, 944);
    			attr_dev(a, "href", /*link*/ ctx[2].link);
    			add_location(a, file$2, 21, 14, 924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, i);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(21:12) {#each socialMediaLinks as link}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let footer;
    	let div4;
    	let div3;
    	let div1;
    	let div0;
    	let t0;
    	let div2;
    	let p;
    	let t1;
    	let t2;
    	let t3;
    	let span;
    	let t5;
    	let each_value = /*socialMediaLinks*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div2 = element("div");
    			p = element("p");
    			t1 = text("2020 - ");
    			t2 = text(/*currentYear*/ ctx[0]);
    			t3 = space();
    			span = element("span");
    			span.textContent = "©";
    			t5 = text(" Copyright - All Right Reserved");
    			attr_dev(div0, "class", "nav justify-content-center justify-content-md-start");
    			add_location(div0, file$2, 19, 10, 797);
    			attr_dev(div1, "class", "col-md-6 py-2");
    			add_location(div1, file$2, 18, 8, 758);
    			set_style(span, "font-size", "1.4rem");
    			add_location(span, file$2, 26, 47, 1143);
    			attr_dev(p, "class", "m-0");
    			add_location(p, file$2, 26, 10, 1106);
    			attr_dev(div2, "class", "col-md-6 py-2 text-center text-md-end");
    			add_location(div2, file$2, 25, 8, 1043);
    			attr_dev(div3, "class", "row align-items-center");
    			add_location(div3, file$2, 17, 6, 712);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$2, 16, 4, 681);
    			attr_dev(footer, "class", "footer");
    			add_location(footer, file$2, 15, 2, 652);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, p);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, span);
    			append_dev(p, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*socialMediaLinks*/ 2) {
    				each_value = /*socialMediaLinks*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let currentYear = new Date().getFullYear();

    	let socialMediaLinks = [
    		{
    			name: 'Facebook',
    			iconClass: 'fab fa-facebook-f',
    			link: 'https://www.facebook.com/iamragahvan'
    		},
    		{
    			name: 'Twitter',
    			iconClass: 'fab fa-twitter',
    			link: 'https://twitter.com/iraghavan_ceo'
    		},
    		{
    			name: 'Instagram',
    			iconClass: 'fab fa-instagram',
    			link: 'https://www.instagram.com/iam.raghavan/'
    		},
    		{
    			name: 'LinkedIn',
    			iconClass: 'fab fa-linkedin-in',
    			link: 'https://www.linkedin.com/in/jsraghavan/'
    		},
    		{
    			name: 'Github',
    			iconClass: 'fab fa-github',
    			link: 'https://github.com/iamraghavan'
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ currentYear, socialMediaLinks });

    	$$self.$inject_state = $$props => {
    		if ('currentYear' in $$props) $$invalidate(0, currentYear = $$props.currentYear);
    		if ('socialMediaLinks' in $$props) $$invalidate(1, socialMediaLinks = $$props.socialMediaLinks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentYear, socialMediaLinks];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */
    const file$1 = "src\\App.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let header;
    	let t0;
    	let main;
    	let home;
    	let t1;
    	let raghavan;
    	let t2;
    	let services;
    	let t3;
    	let skills;
    	let t4;
    	let cta;
    	let t5;
    	let project;
    	let t6;
    	let contact;
    	let t7;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	home = new Home({
    			props: { name: /*name*/ ctx[0] },
    			$$inline: true
    		});

    	raghavan = new Raghavan({
    			props: { name: /*name*/ ctx[0] },
    			$$inline: true
    		});

    	services = new Services({ $$inline: true });
    	skills = new Skills({ $$inline: true });
    	cta = new Cta({ $$inline: true });
    	project = new Project({ $$inline: true });
    	contact = new Contact({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(home.$$.fragment);
    			t1 = space();
    			create_component(raghavan.$$.fragment);
    			t2 = space();
    			create_component(services.$$.fragment);
    			t3 = space();
    			create_component(skills.$$.fragment);
    			t4 = space();
    			create_component(cta.$$.fragment);
    			t5 = space();
    			create_component(project.$$.fragment);
    			t6 = space();
    			create_component(contact.$$.fragment);
    			t7 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "wrapper");
    			add_location(main, file$1, 20, 4, 558);
    			add_location(div, file$1, 18, 0, 534);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(header, div, null);
    			append_dev(div, t0);
    			append_dev(div, main);
    			mount_component(home, main, null);
    			append_dev(main, t1);
    			mount_component(raghavan, main, null);
    			append_dev(main, t2);
    			mount_component(services, main, null);
    			append_dev(main, t3);
    			mount_component(skills, main, null);
    			append_dev(main, t4);
    			mount_component(cta, main, null);
    			append_dev(main, t5);
    			mount_component(project, main, null);
    			append_dev(main, t6);
    			mount_component(contact, main, null);
    			append_dev(div, t7);
    			mount_component(footer, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(home.$$.fragment, local);
    			transition_in(raghavan.$$.fragment, local);
    			transition_in(services.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			transition_in(cta.$$.fragment, local);
    			transition_in(project.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(home.$$.fragment, local);
    			transition_out(raghavan.$$.fragment, local);
    			transition_out(services.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			transition_out(cta.$$.fragment, local);
    			transition_out(project.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(header);
    			destroy_component(home);
    			destroy_component(raghavan);
    			destroy_component(services);
    			destroy_component(skills);
    			destroy_component(cta);
    			destroy_component(project);
    			destroy_component(contact);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let name = "Raghavan";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Contact,
    		Cta,
    		Header,
    		Home,
    		Project,
    		Raghavan,
    		Services,
    		Skills,
    		Footer,
    		name
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const LOCATION = {};
    const ROUTER = {};
    const HISTORY = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const PARAM = /^:(.+)/;
    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Split up the URI into segments delimited by `/`
     * Strip starting/ending `/`
     * @param {string} uri
     * @return {string[]}
     */
    const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
    /**
     * Strip `str` of potential start and end `/`
     * @param {string} string
     * @return {string}
     */
    const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    const rankRoute = (route, index) => {
        const score = route.default
            ? 0
            : segmentize(route.path).reduce((score, segment) => {
                  score += SEGMENT_POINTS;

                  if (segment === "") {
                      score += ROOT_POINTS;
                  } else if (PARAM.test(segment)) {
                      score += DYNAMIC_POINTS;
                  } else if (segment[0] === "*") {
                      score -= SEGMENT_POINTS + SPLAT_PENALTY;
                  } else {
                      score += STATIC_POINTS;
                  }

                  return score;
              }, 0);

        return { route, score, index };
    };
    /**
     * Give a score to all routes and sort them on that
     * If two routes have the exact same score, we go by index instead
     * @param {object[]} routes
     * @return {object[]}
     */
    const rankRoutes = (routes) =>
        routes
            .map(rankRoute)
            .sort((a, b) =>
                a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
            );
    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    const pick = (routes, uri) => {
        let match;
        let default_;

        const [uriPathname] = uri.split("?");
        const uriSegments = segmentize(uriPathname);
        const isRootUri = uriSegments[0] === "";
        const ranked = rankRoutes(routes);

        for (let i = 0, l = ranked.length; i < l; i++) {
            const route = ranked[i].route;
            let missed = false;

            if (route.default) {
                default_ = {
                    route,
                    params: {},
                    uri,
                };
                continue;
            }

            const routeSegments = segmentize(route.path);
            const params = {};
            const max = Math.max(uriSegments.length, routeSegments.length);
            let index = 0;

            for (; index < max; index++) {
                const routeSegment = routeSegments[index];
                const uriSegment = uriSegments[index];

                if (routeSegment && routeSegment[0] === "*") {
                    // Hit a splat, just grab the rest, and return a match
                    // uri:   /files/documents/work
                    // route: /files/* or /files/*splatname
                    const splatName =
                        routeSegment === "*" ? "*" : routeSegment.slice(1);

                    params[splatName] = uriSegments
                        .slice(index)
                        .map(decodeURIComponent)
                        .join("/");
                    break;
                }

                if (typeof uriSegment === "undefined") {
                    // URI is shorter than the route, no match
                    // uri:   /users
                    // route: /users/:userId
                    missed = true;
                    break;
                }

                const dynamicMatch = PARAM.exec(routeSegment);

                if (dynamicMatch && !isRootUri) {
                    const value = decodeURIComponent(uriSegment);
                    params[dynamicMatch[1]] = value;
                } else if (routeSegment !== uriSegment) {
                    // Current segments don't match, not dynamic, not splat, so no match
                    // uri:   /users/123/settings
                    // route: /users/:id/profile
                    missed = true;
                    break;
                }
            }

            if (!missed) {
                match = {
                    route,
                    params,
                    uri: "/" + uriSegments.slice(0, index).join("/"),
                };
                break;
            }
        }

        return match || default_ || null;
    };
    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    const combinePaths = (basepath, path) =>
        `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;

    const canUseDOM = () =>
        typeof window !== "undefined" &&
        "document" in window &&
        "location" in window;

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const getLocation = (source) => {
        return {
            ...source.location,
            state: source.history.state,
            key: (source.history.state && source.history.state.key) || "initial",
        };
    };
    const createHistory = (source) => {
        const listeners = [];
        let location = getLocation(source);

        return {
            get location() {
                return location;
            },

            listen(listener) {
                listeners.push(listener);

                const popstateListener = () => {
                    location = getLocation(source);
                    listener({ location, action: "POP" });
                };

                source.addEventListener("popstate", popstateListener);

                return () => {
                    source.removeEventListener("popstate", popstateListener);
                    const index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                };
            },

            navigate(to, { state, replace = false, preserveScroll = false } = {}) {
                state = { ...state, key: Date.now() + "" };
                // try...catch iOS Safari limits to 100 pushState calls
                try {
                    if (replace) source.history.replaceState(state, "", to);
                    else source.history.pushState(state, "", to);
                } catch (e) {
                    source.location[replace ? "replace" : "assign"](to);
                }
                location = getLocation(source);
                listeners.forEach((listener) =>
                    listener({ location, action: "PUSH", preserveScroll })
                );
                document.activeElement.blur();
            },
        };
    };
    // Stores history entries in memory for testing or other platforms like Native
    const createMemorySource = (initialPathname = "/") => {
        let index = 0;
        const stack = [{ pathname: initialPathname, search: "" }];
        const states = [];

        return {
            get location() {
                return stack[index];
            },
            addEventListener(name, fn) {},
            removeEventListener(name, fn) {},
            history: {
                get entries() {
                    return stack;
                },
                get index() {
                    return index;
                },
                get state() {
                    return states[index];
                },
                pushState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    index++;
                    stack.push({ pathname, search });
                    states.push(state);
                },
                replaceState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    stack[index] = { pathname, search };
                    states[index] = state;
                },
            },
        };
    };
    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const globalHistory = createHistory(
        canUseDOM() ? window : createMemorySource()
    );

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;
    const file = "node_modules\\svelte-routing\\src\\Router.svelte";

    const get_default_slot_changes_1 = dirty => ({
    	route: dirty & /*$activeRoute*/ 4,
    	location: dirty & /*$location*/ 2
    });

    const get_default_slot_context_1 = ctx => ({
    	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
    	location: /*$location*/ ctx[1]
    });

    const get_default_slot_changes = dirty => ({
    	route: dirty & /*$activeRoute*/ 4,
    	location: dirty & /*$location*/ 2
    });

    const get_default_slot_context = ctx => ({
    	route: /*$activeRoute*/ ctx[2] && /*$activeRoute*/ ctx[2].uri,
    	location: /*$location*/ ctx[1]
    });

    // (141:0) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(141:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (132:0) {#if viewtransition}
    function create_if_block(ctx) {
    	let previous_key = /*$location*/ ctx[1].pathname;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$location*/ 2 && safe_not_equal(previous_key, previous_key = /*$location*/ ctx[1].pathname)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(132:0) {#if viewtransition}",
    		ctx
    	});

    	return block;
    }

    // (133:4) {#key $location.pathname}
    function create_key_block(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file, 133, 8, 4613);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 16390)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, /*viewtransitionFn*/ ctx[3], {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*viewtransitionFn*/ ctx[3], {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(133:4) {#key $location.pathname}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*viewtransition*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let $activeRoute;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	let { viewtransition = null } = $$props;
    	let { history = globalHistory } = $$props;

    	const viewtransitionFn = (node, _, direction) => {
    		const vt = viewtransition(direction);
    		if (typeof vt?.fn === "function") return vt.fn(node, vt); else return vt;
    	};

    	setContext(HISTORY, history);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(12, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(2, $activeRoute = value));
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : history.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(1, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (!activeRoute) return base;

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	const registerRoute = route => {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) return;

    			const matchingRoute = pick([route], $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => [...rs, route]);
    		}
    	};

    	const unregisterRoute = route => {
    		routes.update(rs => rs.filter(r => r !== route));
    	};

    	let preserveScroll = false;

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(event => {
    				$$invalidate(11, preserveScroll = event.preserveScroll || false);
    				location.set(event.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url', 'viewtransition', 'history'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(9, url = $$props.url);
    		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
    		if ('history' in $$props) $$invalidate(10, history = $$props.history);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		setContext,
    		derived,
    		writable,
    		HISTORY,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		combinePaths,
    		pick,
    		basepath,
    		url,
    		viewtransition,
    		history,
    		viewtransitionFn,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		preserveScroll,
    		$location,
    		$routes,
    		$base,
    		$activeRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(8, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(9, url = $$props.url);
    		if ('viewtransition' in $$props) $$invalidate(0, viewtransition = $$props.viewtransition);
    		if ('history' in $$props) $$invalidate(10, history = $$props.history);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    		if ('preserveScroll' in $$props) $$invalidate(11, preserveScroll = $$props.preserveScroll);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 8192) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;
    				routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/ 6146) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set({ ...bestMatch, preserveScroll });
    			}
    		}
    	};

    	return [
    		viewtransition,
    		$location,
    		$activeRoute,
    		viewtransitionFn,
    		routes,
    		activeRoute,
    		location,
    		base,
    		basepath,
    		url,
    		history,
    		preserveScroll,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance, create_fragment, safe_not_equal, {
    			basepath: 8,
    			url: 9,
    			viewtransition: 0,
    			history: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewtransition() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewtransition(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const base = '/'; // Set your base URL here

    const app = new App({
      target: document.body,
      props: {
        // ...other props
      },
      context: new Map([[Router, { base }]]), // Provide the base property
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
