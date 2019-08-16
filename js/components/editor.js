Vue.component('editor', {
    template: `
        <div ref="editor"></div>   
    `,
    props: {
        element: Object
    },
    mounted() {
        const { html } = this.element;
        const editor = CKEDITOR.replace(this.$refs.editor);
        editor.setData( html );
        editor.on('change', () => {
            this.element.html = editor.getData();
        });
    }
});