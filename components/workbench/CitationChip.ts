import { Node as TiptapNode } from '@tiptap/core';

export const CitationChip = TiptapNode.create({
    name: 'citation',
    group: 'inline',
    inline: true,
    atom: true,
    selectable: false,

    addAttributes() {
        return {
            lineId: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-line') || '',
                renderHTML: (attributes) => ({ 'data-line': attributes.lineId }),
            },
            sessionId: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-session') || '',
                renderHTML: (attributes) => ({ 'data-session': attributes.sessionId }),
            },
            speaker: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-speaker') || '',
                renderHTML: (attributes) => ({ 'data-speaker': attributes.speaker }),
            },
            label: {
                default: '',
                parseHTML: (element) => element.textContent || '',
                renderHTML: () => ({}),
            },
        };
    },

    parseHTML() {
        return [{ tag: 'cite[data-line][data-session]' }];
    },

    renderHTML({ node, HTMLAttributes }) {
        const { lineId, sessionId, speaker, label } = node.attrs;
        return [
            'cite',
            {
                ...HTMLAttributes,
                'data-line': lineId,
                'data-session': sessionId,
                'data-speaker': speaker,
            },
            label || '[引用]',
        ];
    },

    renderText({ node }) {
        return node.attrs.label || '[引用]';
    },
});
