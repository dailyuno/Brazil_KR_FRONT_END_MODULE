const EventBus = new Vue();

const app = new Vue({
    el: '#app',
    data() {
        return {
            elements: [
                this.makeElement({
                    id: 'begin',
                    pos: {x: 200, y: 200}
                }),
                this.makeElement({
                    id: 'final',
                    pos: {x: 500, y: 200}
                }),
                this.makeElement({
                    id: 1,
                    pos: {x: 300, y: 500}
                }),
                this.makeElement({
                    id: 2,
                    pos: {x: 700, y: 600}
                }),
                this.makeElement({
                    id: 3,
                    pos: {x: 100, y: 400}
                }),
                this.makeElement({
                    id: 4,
                    pos: {x: 800, y: 400}
                })
            ],

            links: [
                this.makeLink({
                    origin: 1,
                    target: 2
                }),
                this.makeLink({
                    origin: 2,
                    target: 3,
                    type: 'correct'
                }),
                this.makeLink({
                    origin: 'begin',
                    target: 1
                }),
                this.makeLink({
                    origin: 'begin',
                    target: 3,
                    type: 'correct'
                }),
                this.makeLink({
                    origin: 3,
                    target: 'final',
                    type: 'correct'
                }),
                this.makeLink({
                    origin: 2,
                    target: 4
                }),
                this.makeLink({
                    origin: 4,
                    target: 1,
                    type: 'correct'
                })
            ],

            mode: 'edit',

            clone: null
        }
    },
    methods: {
        restore() {
            const elements = localStorage.getItem('KR-elements');
            const links = localStorage.getItem('KR-links');

            if (elements) {
                this.elements = JSON.parse(elements);
            }

            if (links) {
                this.links = JSON.parse(links).map(x => {
                    return Object.assign({}, x, {
                        origin: this.findElement(x.origin),
                        target: this.findElement(x.target)
                    });
                });
            }
        },
        deSelectItem() {
            this.elements.forEach(x => x.selected = false);
            this.links.forEach(x => x.selected = false);
        },
        removeSelectItem({ key }) {
            if (key === 'Delete') {
                if (this.selectedElement) {
                    this.removeElement(this.selectedElement);
                }

                if (this.selectedLink) {
                    this.removeLink(this.selectedLink);
                }
            }
        },
        findElement(id) {
            return this.elements.find(x => x.id === id);
        },
        makeElement(option = {}) {
            return {
                id: option.id || uuid(),
                pos: option.pos || {x: 0, y: 0},
                selected: option.selected || false,
                html: option.html || '',
                clone: option.clone || false
            };
        },
        createElement(option) {
            const element = this.makeElement(option);
            this.elements.push(element);
            return element;
        },
        removeElement({ id }) {
            if (id === 'begin' || id === 'final') return;
            this.links = this.links.filter(x => {
                return (x.origin.id !== id && x.target.id !== id);
            });
            this.elements.splice(this.elements.findIndex(x => x.id === id), 1);
        },
        selectElement(element) {
            this.deSelectItem();
            element.selected = true;
        },
        makeLink(option = {}) {
            return {
                id: option.id || uuid(),
                origin: option.origin,
                target: option.target,
                selected: option.selected || false,
                caption: option.caption || '',
                type: option.type || 'incorrect',
                clone: option.clone || false
            }
        },
        createLink(option) {
            const link = this.makeLink(option);
            this.links.push(link);
            return link;
        },
        removeLink({ id }) {
            this.links.splice(this.links.findIndex(x => x.id === id), 1);
        },
        selectLink(link) {
            this.deSelectItem();
            link.selected = true;
        },
        makeClone(ev, element) {
            this.clone = element;
            const clone = this.createElement({
                pos: Object.assign({}, element.pos),
                clone: true
            });

            this.createLink({
                origin: element,
                target: clone,
                clone: true
            });

            draggable(ev, clone);

            document.onmouseup = () => {
                this.elements.forEach(x => x.clone = false);
                this.links.forEach(x => x.clone = false);
                this.clone = null;
                document.onmouseup = null;
            };
        },
        saveClone(ev, element) {
            const clone = this.elements.find(x => x.clone === true);

            if (clone) {
                this.removeElement(clone);
                this.createLink({
                    origin: this.clone,
                    target: element
                });
            }
        },
        changeDirection(link) {
            [link.origin, link.target] = [link.target, link.origin];
        },

        editMode() {
            this.mode = 'edit';
            document.exitFullscreen();
        },

        viewMode() {
            this.mode = 'view';
            const app = this.$refs.app;

            if (app.requestFullscreen) {
                app.requestFullscreen();
            }
        }
    },
    computed: {
        selectedElement() {
            return this.elements.find(x => x.selected === true);
        },
        selectedLink() {
            return this.links.find(x => x.selected === true);
        },
        isView() {
            return this.mode === 'view';
        }
    },
    watch: {
        elements: {
            deep: true,
            handler() {
                localStorage.setItem('KR-elements', JSON.stringify(this.elements));
            }
        },
        links: {
            deep: true,
            handler() {
                const links = this.links.map(x => {
                    return Object.assign({}, x, {
                        origin: x.origin.id,
                        target: x.target.id
                    });
                });

                localStorage.setItem('KR-links', JSON.stringify(links));
            }
        }
    },
    created() {
        this.links = this.links.map(x => {
            return Object.assign({}, x, {
                origin: this.findElement(x.origin),
                target: this.findElement(x.target)
            });
        });

        this.restore();

        console.log(this.elements);

        document.addEventListener('click', this.deSelectItem.bind(this));

        document.addEventListener('keydown', this.removeSelectItem.bind(this));

        EventBus.$on('select.element', this.selectElement);

        EventBus.$on('select.link', this.selectLink);

        EventBus.$on('make.clone', this.makeClone);

        EventBus.$on('save.clone', this.saveClone);

        EventBus.$on('link.change.direction', this.changeDirection);
    }
});