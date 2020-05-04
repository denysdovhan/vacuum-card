/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render$1 = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = parts.get(renderContainer);
        parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof TemplateInstance ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        removeNodes(container, container.firstChild);
        container.appendChild(renderContainer);
        parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this._updateState = 0;
        this._instanceProperties = undefined;
        // Initialize to an unresolved Promise so we can make sure the element has
        // connected before first update.
        this._updatePromise = new Promise((res) => this._enableUpdatingResolver = res);
        /**
         * Map with keys for any properties that have changed since the last
         * update cycle with previous values.
         */
        this._changedProperties = new Map();
        /**
         * Map with keys of properties that should be reflected when updated.
         */
        this._reflectingProperties = undefined;
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, _options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this._requestUpdate(name, oldValue);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    _requestUpdate(name, oldValue) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            const options = ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this._requestUpdate(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    _getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's `style` property to
 * set element styles. For security reasons, only literal string values may be
 * used. To incorporate non-literal values `unsafeCSS` may be used inside a
 * template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.3.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (userStyles === undefined) {
            this._styles = [];
        }
        else if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = [userStyles];
        }
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot =
            this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it.
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's NodePart - typically a TemplateResult.
     * Setting properties inside this method will *not* trigger the element to
     * update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
LitElement['finalized'] = true;
/**
 * Render method used to render the value to the element's DOM.
 * @param result The value to render.
 * @param container Node into which to render.
 * @param options Element name.
 * @nocollapse
 */
LitElement.render = render$1;

var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
var twoDigitsOptional = "[1-9]\\d?";
var twoDigits = "\\d\\d";
var threeDigits = "\\d{3}";
var fourDigits = "\\d{4}";
var word = "[^\\s]+";
var literal = /\[([^]*?)\]/gm;
function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
}
var monthUpdate = function (arrName) { return function (v, i18n) {
    var lowerCaseArr = i18n[arrName].map(function (v) { return v.toLowerCase(); });
    var index = lowerCaseArr.indexOf(v.toLowerCase());
    if (index > -1) {
        return index;
    }
    return null;
}; };
function assign(origObj) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var obj = args_1[_a];
        for (var key in obj) {
            // @ts-ignore ex
            origObj[key] = obj[key];
        }
    }
    return origObj;
}
var dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var monthNamesShort = shorten(monthNames, 3);
var dayNamesShort = shorten(dayNames, 3);
var defaultI18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ["am", "pm"],
    DoFn: function (dayOfMonth) {
        return (dayOfMonth +
            ["th", "st", "nd", "rd"][dayOfMonth % 10 > 3
                ? 0
                : ((dayOfMonth - (dayOfMonth % 10) !== 10 ? 1 : 0) * dayOfMonth) % 10]);
    }
};
var globalI18n = assign({}, defaultI18n);
var setGlobalDateI18n = function (i18n) {
    return (globalI18n = assign(globalI18n, i18n));
};
var regexEscape = function (str) {
    return str.replace(/[|\\{()[^$+*?.-]/g, "\\$&");
};
var pad = function (val, len) {
    if (len === void 0) { len = 2; }
    val = String(val);
    while (val.length < len) {
        val = "0" + val;
    }
    return val;
};
var formatFlags = {
    D: function (dateObj) { return String(dateObj.getDate()); },
    DD: function (dateObj) { return pad(dateObj.getDate()); },
    Do: function (dateObj, i18n) {
        return i18n.DoFn(dateObj.getDate());
    },
    d: function (dateObj) { return String(dateObj.getDay()); },
    dd: function (dateObj) { return pad(dateObj.getDay()); },
    ddd: function (dateObj, i18n) {
        return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function (dateObj, i18n) {
        return i18n.dayNames[dateObj.getDay()];
    },
    M: function (dateObj) { return String(dateObj.getMonth() + 1); },
    MM: function (dateObj) { return pad(dateObj.getMonth() + 1); },
    MMM: function (dateObj, i18n) {
        return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function (dateObj, i18n) {
        return i18n.monthNames[dateObj.getMonth()];
    },
    YY: function (dateObj) {
        return pad(String(dateObj.getFullYear()), 4).substr(2);
    },
    YYYY: function (dateObj) { return pad(dateObj.getFullYear(), 4); },
    h: function (dateObj) { return String(dateObj.getHours() % 12 || 12); },
    hh: function (dateObj) { return pad(dateObj.getHours() % 12 || 12); },
    H: function (dateObj) { return String(dateObj.getHours()); },
    HH: function (dateObj) { return pad(dateObj.getHours()); },
    m: function (dateObj) { return String(dateObj.getMinutes()); },
    mm: function (dateObj) { return pad(dateObj.getMinutes()); },
    s: function (dateObj) { return String(dateObj.getSeconds()); },
    ss: function (dateObj) { return pad(dateObj.getSeconds()); },
    S: function (dateObj) {
        return String(Math.round(dateObj.getMilliseconds() / 100));
    },
    SS: function (dateObj) {
        return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function (dateObj) { return pad(dateObj.getMilliseconds(), 3); },
    a: function (dateObj, i18n) {
        return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function (dateObj, i18n) {
        return dateObj.getHours() < 12
            ? i18n.amPm[0].toUpperCase()
            : i18n.amPm[1].toUpperCase();
    },
    ZZ: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return ((offset > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(offset) / 60) * 100 + (Math.abs(offset) % 60), 4));
    },
    Z: function (dateObj) {
        var offset = dateObj.getTimezoneOffset();
        return ((offset > 0 ? "-" : "+") +
            pad(Math.floor(Math.abs(offset) / 60), 2) +
            ":" +
            pad(Math.abs(offset) % 60, 2));
    }
};
var monthParse = function (v) { return +v - 1; };
var emptyDigits = [null, twoDigitsOptional];
var emptyWord = [null, word];
var amPm = [
    "isPm",
    word,
    function (v, i18n) {
        var val = v.toLowerCase();
        if (val === i18n.amPm[0]) {
            return 0;
        }
        else if (val === i18n.amPm[1]) {
            return 1;
        }
        return null;
    }
];
var timezoneOffset = [
    "timezoneOffset",
    "[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",
    function (v) {
        var parts = (v + "").match(/([+-]|\d\d)/gi);
        if (parts) {
            var minutes = +parts[1] * 60 + parseInt(parts[2], 10);
            return parts[0] === "+" ? minutes : -minutes;
        }
        return 0;
    }
];
var parseFlags = {
    D: ["day", twoDigitsOptional],
    DD: ["day", twoDigits],
    Do: ["day", twoDigitsOptional + word, function (v) { return parseInt(v, 10); }],
    M: ["month", twoDigitsOptional, monthParse],
    MM: ["month", twoDigits, monthParse],
    YY: [
        "year",
        twoDigits,
        function (v) {
            var now = new Date();
            var cent = +("" + now.getFullYear()).substr(0, 2);
            return +("" + (+v > 68 ? cent - 1 : cent) + v);
        }
    ],
    h: ["hour", twoDigitsOptional, undefined, "isPm"],
    hh: ["hour", twoDigits, undefined, "isPm"],
    H: ["hour", twoDigitsOptional],
    HH: ["hour", twoDigits],
    m: ["minute", twoDigitsOptional],
    mm: ["minute", twoDigits],
    s: ["second", twoDigitsOptional],
    ss: ["second", twoDigits],
    YYYY: ["year", fourDigits],
    S: ["millisecond", "\\d", function (v) { return +v * 100; }],
    SS: ["millisecond", twoDigits, function (v) { return +v * 10; }],
    SSS: ["millisecond", threeDigits],
    d: emptyDigits,
    dd: emptyDigits,
    ddd: emptyWord,
    dddd: emptyWord,
    MMM: ["month", word, monthUpdate("monthNamesShort")],
    MMMM: ["month", word, monthUpdate("monthNames")],
    a: amPm,
    A: amPm,
    ZZ: timezoneOffset,
    Z: timezoneOffset
};
// Some common format strings
var globalMasks = {
    default: "ddd MMM DD YYYY HH:mm:ss",
    shortDate: "M/D/YY",
    mediumDate: "MMM D, YYYY",
    longDate: "MMMM D, YYYY",
    fullDate: "dddd, MMMM D, YYYY",
    isoDate: "YYYY-MM-DD",
    isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
    shortTime: "HH:mm",
    mediumTime: "HH:mm:ss",
    longTime: "HH:mm:ss.SSS"
};
var setGlobalDateMasks = function (masks) { return assign(globalMasks, masks); };
/***
 * Format a date
 * @method format
 * @param {Date|number} dateObj
 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
 * @returns {string} Formatted date string
 */
var format = function (dateObj, mask, i18n) {
    if (mask === void 0) { mask = globalMasks["default"]; }
    if (i18n === void 0) { i18n = {}; }
    if (typeof dateObj === "number") {
        dateObj = new Date(dateObj);
    }
    if (Object.prototype.toString.call(dateObj) !== "[object Date]" ||
        isNaN(dateObj.getTime())) {
        throw new Error("Invalid Date pass to format");
    }
    mask = globalMasks[mask] || mask;
    var literals = [];
    // Make literals inactive by replacing them with @@@
    mask = mask.replace(literal, function ($0, $1) {
        literals.push($1);
        return "@@@";
    });
    var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {
        return formatFlags[$0](dateObj, combinedI18nSettings);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/@@@/g, function () { return literals.shift(); });
};
/**
 * Parse a date string into a Javascript Date object /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @param {i18n} I18nSettingsOptional Full or subset of I18N settings
 * @returns {Date|null} Returns Date object. Returns null what date string is invalid or doesn't match format
 */
function parse(dateStr, format, i18n) {
    if (i18n === void 0) { i18n = {}; }
    if (typeof format !== "string") {
        throw new Error("Invalid format in fecha parse");
    }
    // Check to see if the format is actually a mask
    format = globalMasks[format] || format;
    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
        return null;
    }
    // Default to the beginning of the year.
    var today = new Date();
    var dateInfo = {
        year: today.getFullYear(),
        month: 0,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        isPm: null,
        timezoneOffset: null
    };
    var parseInfo = [];
    var literals = [];
    // Replace all the literals with @@@. Hopefully a string that won't exist in the format
    var newFormat = format.replace(literal, function ($0, $1) {
        literals.push(regexEscape($1));
        return "@@@";
    });
    var specifiedFields = {};
    var requiredFields = {};
    // Change every token that we find into the correct regex
    newFormat = regexEscape(newFormat).replace(token, function ($0) {
        var info = parseFlags[$0];
        var field = info[0], regex = info[1], requiredField = info[3];
        // Check if the person has specified the same field twice. This will lead to confusing results.
        if (specifiedFields[field]) {
            throw new Error("Invalid format. " + field + " specified twice in format");
        }
        specifiedFields[field] = true;
        // Check if there are any required fields. For instance, 12 hour time requires AM/PM specified
        if (requiredField) {
            requiredFields[requiredField] = true;
        }
        parseInfo.push(info);
        return "(" + regex + ")";
    });
    // Check all the required fields are present
    Object.keys(requiredFields).forEach(function (field) {
        if (!specifiedFields[field]) {
            throw new Error("Invalid format. " + field + " is required in specified format");
        }
    });
    // Add back all the literals after
    newFormat = newFormat.replace(/@@@/g, function () { return literals.shift(); });
    // Check if the date string matches the format. If it doesn't return null
    var matches = dateStr.match(new RegExp(newFormat, "i"));
    if (!matches) {
        return null;
    }
    var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
    // For each match, call the parser function for that date part
    for (var i = 1; i < matches.length; i++) {
        var _a = parseInfo[i - 1], field = _a[0], parser = _a[2];
        var value = parser
            ? parser(matches[i], combinedI18nSettings)
            : +matches[i];
        // If the parser can't make sense of the value, return null
        if (value == null) {
            return null;
        }
        dateInfo[field] = value;
    }
    if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) {
        dateInfo.hour = +dateInfo.hour + 12;
    }
    else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) {
        dateInfo.hour = 0;
    }
    var dateWithoutTZ = new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute, dateInfo.second, dateInfo.millisecond);
    var validateFields = [
        ["month", "getMonth"],
        ["day", "getDate"],
        ["hour", "getHours"],
        ["minute", "getMinutes"],
        ["second", "getSeconds"]
    ];
    for (var i = 0, len = validateFields.length; i < len; i++) {
        // Check to make sure the date field is within the allowed range. Javascript dates allows values
        // outside the allowed range. If the values don't match the value was invalid
        if (specifiedFields[validateFields[i][0]] &&
            dateInfo[validateFields[i][0]] !== dateWithoutTZ[validateFields[i][1]]()) {
            return null;
        }
    }
    if (dateInfo.timezoneOffset == null) {
        return dateWithoutTZ;
    }
    return new Date(Date.UTC(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute - dateInfo.timezoneOffset, dateInfo.second, dateInfo.millisecond));
}
var fecha = {
    format: format,
    parse: parse,
    defaultI18n: defaultI18n,
    setGlobalDateI18n: setGlobalDateI18n,
    setGlobalDateMasks: setGlobalDateMasks
};

var a=function(){try{(new Date).toLocaleDateString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleDateString(t,{year:"numeric",month:"long",day:"numeric"})}:function(t){return fecha.format(t,"mediumDate")},r=function(){try{(new Date).toLocaleString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleString(t,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"haDateTime")},n=function(){try{(new Date).toLocaleTimeString("i");}catch(e){return "RangeError"===e.name}return !1}()?function(e,t){return e.toLocaleTimeString(t,{hour:"numeric",minute:"2-digit"})}:function(t){return fecha.format(t,"shortTime")};var C=function(e,t,a,r){r=r||{},a=null==a?{}:a;var n=new Event(t,{bubbles:void 0===r.bubbles||r.bubbles,cancelable:Boolean(r.cancelable),composed:void 0===r.composed||r.composed});return n.detail=a,e.dispatchEvent(n),n};function Y(e,t,a){if(t.has("config")||a)return !0;if(e.config.entity){var r=t.get("hass");return !r||r.states[e.config.entity]!==e.hass.states[e.config.entity]}return !1}

customElements.define('vacuum-card-editor', VacuumCard);

var styles = css`
  :host {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  ha-card {
    flex-direction: column;
    flex: 1;
    position: relative;
    padding: 0px;
    border-radius: 4px;
    overflow: hidden;
  }

  .preview {
    background: var(--primary-color);
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }

  .map {
    display: block;
    max-width: 90%;
    image-rendering: crisp-edges;
  }

  @keyframes cleaning {
    0% {
      transform: rotate(0) translate(0);
    }
    5% {
      transform: rotate(0) translate(0, -10px);
    }
    10% {
      transform: rotate(0) translate(0, 5px);
    }
    15% {
      transform: rotate(0) translate(0);
    }
    /* Turn left */
    20% {
      transform: rotate(30deg) translate(0);
    }
    25% {
      transform: rotate(30deg) translate(0, -10px);
    }
    30% {
      transform: rotate(30deg) translate(0, 5px);
    }
    35% {
      transform: rotate(30deg) translate(0);
    }
    40% {
      transform: rotate(0) translate(0);
    }
    /* Turn right */
    45% {
      transform: rotate(-30deg) translate(0);
    }
    50% {
      transform: rotate(-30deg) translate(0, -10px);
    }
    55% {
      transform: rotate(-30deg) translate(0, 5px);
    }
    60% {
      transform: rotate(-30deg) translate(0);
    }
    70% {
      transform: rotate(0deg) translate(0);
    }
    /* Staying still */
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes returning {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(10deg);
    }
    50% {
      transform: rotate(0);
    }
    75% {
      transform: rotate(-10deg);
    }
    100% {
      transform: rotate(0);
    }
  }

  .vacuum {
    display: block;
    max-width: 90%;
    max-height: 200px;
    image-rendering: crisp-edges;
    margin: 30px auto 20px auto;
  }

  .vacuum.cleaning {
    animation: cleaning 5s linear infinite;
  }

  .vacuum.returning {
    animation: returning 2s linear infinite;
  }

  .vacuum.paused {
    opacity: 100%;
  }

  .vacuum.docked {
    opacity: 50%;
  }

  .fill-gap {
    flex-grow: 1;
  }

  .battery {
    text-align: right;
    font-weight: bold;
    padding: 9px 20px;
  }

  .source {
    text-align: center;
  }

  .status {
    height: 40px;
    display: flex;
    align-items: center;
    font-weight: bold;
    padding: 9px 20px;
    text-align: left;
  }

  .status-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .status paper-spinner {
    min-width: 20px;
    width: 20px;
    height: 20px;
    margin-left: 9px;
  }

  .stats {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    color: var(--text-primary-color)
  }

  .stats-block {
    margin: 10px 0px;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    flex-grow: 1;
  }

  .stats-block:last-child {
    border: 0px;
  }

  .stats-hours {
    font-size: 20px;
    font-weight: bold;
  }

  ha-icon {
    color: #fff;
  }

  .toolbar {
    background: var(--lovelace-background, var(--primary-background-color));
    min-height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .toolbar paper-icon-button {
    color: var(--primary-color);
    flex-direction: column;
    width: 44px;
    height: 44px;
    margin: 5px;
    padding: 10px;
  }

  .toolbar paper-button {
    color: var(--primary-color);
    flex-direction: column;
    margin-right: 10px;
    padding: 15px 10px;
    cursor: pointer;
  }

  .toolbar paper-icon-button:last-child {
    margin-right: 0px;
  }

  .toolbar paper-icon-button:active, .toolbar paper-button:active {
    opacity: 0.4;
    background: rgba(0, 0, 0, 0.1);
  }

  .toolbar paper-button {
    color: var(--primary-color);
    flex-direction: row;
  }

  .toolbar ha-icon {
    color: var(--primary-color);
    padding-right: 15px;
  }

  .header {
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: var(--text-primary-color);
  }

  .header div {
    width: 33.3%;
    box-sizing: border-box;
  }

  .toolbar-split {
    padding-right: 15px;
  }
`;

const img = "data:image/png;base64,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";

class VacuumCard$1 extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
      mapUrl: String,
      requestInProgress: Boolean
    };
  }

  static get styles() {
    return styles;
  }

  static async getConfigElement() {
    return document.createElement('vacuum-card-editor');
  }

  static getStubConfig() {
    return {};
  }

  get entity() {
    return this.hass.states[this.config.entity];
  }

  get map() {
    return this.hass.states[this.config.map];
  }

  get image() {
    return this.config.image || img;
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 2;
  }

  shouldUpdate(changedProps) {
    return Y(this, changedProps);
  }

  updated(changedProps) {
    if (this.map) {
      const url = this.map.attributes.entity_picture + `&t=${new Date().getTime()}`;
      const img = new Image();

      img.onload = () => {
        this.mapUrl = url;
      };

      img.src = url;
    }

    if (changedProps.get('hass') && changedProps.get('hass').states[this.config.entity].state !== this.hass.states[this.config.entity].state) {
      this.requestInProgress = false;
    }
  }

  handleMore() {
    C(this, 'hass-more-info', {
      config: this.config
    });
  }

  handleSpeed(e) {
    const fan_speed = e.target.getAttribute('value');
    this.callService('set_fan_speed', {
      fan_speed
    });
  }

  callService(service, options = {}) {
    this.hass.callService('vacuum', service, {
      entity_id: this.config.entity,
      ...options
    });
    this.requestInProgress = true;
    this.requestUpdate();
  }

  renderSource() {
    const {
      attributes: {
        fan_speed: source,
        fan_speed_list: sources
      }
    } = this.entity;
    const selected = sources.indexOf(source);
    return html`
      <paper-menu-button slot='dropdown-trigger'
        .horizontalAlign=${'right'} .verticalAlign=${'top'}
        .verticalOffset=${40} .noAnimations=${true}
        @click='${e => e.stopPropagation()}'>
        <paper-button class='source-menu__button' slot='dropdown-trigger'>
          <span class='source-menu__source' show=${true}>
            ${source}
          </span>
          <ha-icon icon="mdi:fan"></ha-icon>
        </paper-button>
        <paper-listbox slot='dropdown-content' selected=${selected}
          @click='${e => this.handleSpeed(e)}'>
          ${sources.map(item => html`<paper-item value=${item}>${item}</paper-item>`)}
        </paper-listbox>
      </paper-menu-button>`;
  }

  renderMapOrImage(state) {
    if (this.map) {
      return html`
          <img class="map" src="${this.mapUrl}" />
      `;
    }

    if (this.image) {
      return html`
        <img class="vacuum ${state}" src="${this.image}" />
      `;
    }

    return html``;
  }

  renderStats(state) {
    const {
      attributes: {
        cleaned_area,
        cleaning_time,
        main_brush_left,
        side_brush_left,
        filter_left,
        sensor_dirty_left
      }
    } = this.entity;

    switch (state) {
      case 'cleaning':
        {
          return html`
          <div class="stats-block">
            <span class="stats-hours">${cleaned_area}</span> m<sup>2</sup>
            <div class="stats-subtitle">Cleaning area</div>
          </div>
          <div class="stats-block">
            <span class="stats-hours">${cleaning_time}</span> minutes
            <div class="stats-subtitle">Cleaning time</div>
          </div>
        `;
        }

      case 'docked':
      default:
        {
          return html`
          <div class="stats-block">
            <span class="stats-hours">${filter_left}</span> <sup>hours</sup>
            <div class="stats-subtitle">Filter</div>
          </div>
          <div class="stats-block">
            <span class="stats-hours">${side_brush_left}</span> <sup>hours</sup>
            <div class="stats-subtitle">Side brush</div>
          </div>
          <div class="stats-block">
            <span class="stats-hours">${main_brush_left}</span> <sup>hours</sup>
            <div class="stats-subtitle">Main brush</div>
          </div>
          <div class="stats-block">
            <span class="stats-hours">${sensor_dirty_left}</span> <sup>hours</sup>
            <div class="stats-subtitle">Sensors</div>
          </div>
        `;
        }
    }
  }

  renderToolbar(state) {
    switch (state) {
      case 'cleaning':
        {
          return html`
          <div class="toolbar">
            <paper-button @click='${e => this.callService('pause')}'>
              <ha-icon icon="hass:pause" ></ha-icon>
              Pause
            </paper-button>
            <paper-button @click='${e => this.callService('stop')}'>
              <ha-icon icon="hass:stop" ></ha-icon>
              Stop
            </paper-button>
            <paper-button @click='${e => this.callService('return_to_base')}'>
              <ha-icon icon="hass:home-map-marker" ></ha-icon>
              Dock
            </paper-button>
          </div>
        `;
        }

      case 'paused':
        {
          return html`
          <div class="toolbar">
            <paper-button @click='${e => this.callService('start')}'>
              <ha-icon icon="hass:play" ></ha-icon>
              Continue
            </paper-button>
            <paper-button @click='${e => this.callService('return_to_base')}'>
              <ha-icon icon="hass:home-map-marker" ></ha-icon>
              Dock
            </paper-button>
          </div>
        `;
        }

      case 'returning':
        {
          return html`
          <div class="toolbar">
            <paper-button @click='${e => this.callService('start')}'>
              <ha-icon icon="hass:play" ></ha-icon>
              Continue
            </paper-button>
            <paper-button @click='${e => this.callService('pause')}'>
              <ha-icon icon="hass:pause" ></ha-icon>
              Pause
            </paper-button>
          </div>
        `;
        }

      case 'docked':
      case 'idle':
      default:
        {
          const {
            actions = []
          } = this.config;
          const buttons = actions.map(({
            name,
            service,
            icon
          }) => {
            const execute = () => {
              const args = service.split('.');
              this.hass.callService(args[0], args[1]);
            };

            return html`<paper-icon-button icon="${icon}" title="${name}" @click='${execute}'></paper-icon-button>`;
          });
          const dockButton = html`
          <paper-icon-button
            icon="hass:home-map-marker" 
            title="Dock"
            class="toolbar-icon"
            @click='${e => this.callService('return_to_base')}'
          >
          </paper-icon-button>
        `;
          return html`
          <div class="toolbar">
            <paper-icon-button
              icon="hass:play" 
              title="Clean"
              class="toolbar-icon"
              @click='${e => this.callService('start')}'
            >
            </paper-icon-button>
            
            <paper-icon-button
              icon="mdi:crosshairs-gps" 
              title="Locate vacuum"
              class="toolbar-split"
              @click='${e => this.callService('locate')}'
            >
            </paper-icon-button>
            
            ${state === 'idle' ? dockButton : ''}
            <div class="fill-gap"></div>
            ${buttons}
          </div>
        `;
        }
    }
  }

  render() {
    const {
      state,
      attributes: {
        status,
        battery_level,
        battery_icon
      }
    } = this.entity;
    return html`
      <ha-card>
        <div class="preview" @click='${e => this.handleMore()}' ?more-info=true>
          <div class="header">
            <div class="status">
              <span class="status-text" alt=${status}>${status}</span>
              <paper-spinner ?active=${this.requestInProgress}></paper-spinner>
            </div>
            <div class="source">
              ${this.renderSource()}
            </div>
            <div class="battery">
              ${battery_level}% <ha-icon icon="${battery_icon}"></ha-icon>
            </div>
          </div>

          ${this.renderMapOrImage(state)}
          
          <div class="stats">
            ${this.renderStats(state)}
          </div>
        </div>

        ${this.renderToolbar(state)}
      </ha-card>
    `;
  }

}

customElements.define('vacuum-card', VacuumCard$1);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "vacuum-card",
  name: "Vacuum Card",
  description: "A card for displaying robot vacuum."
});
