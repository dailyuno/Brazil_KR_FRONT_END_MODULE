Vue.component('edit-mode', {
    template: `
        <section class="mode edit-mode"
            @mousedown.shift="moveCanvas">
            <link-wrapper
                :links="links">
            </link-wrapper>
           
            <element-wrapper
                :elements="elements">
            </element-wrapper>
               
            <transition name="fade">
                <div class="app-modal" v-if="edit" @click="edit = null" role="dialog" aria-label="dialog" aria-hidden="true">
                    <div class="modal-mask" @click.stop>
                        <div class="element-edit-container h-100" role="form" aria-label="form" v-if="edit === 'element'">
                            <editor :element="element"></editor>
                        </div>
                        <div class="link-edit-container" v-else>
                            <div class="form-group">
                                <label for="caption">Caption</label>
                                <input type="text" id="caption" class="form-control" v-model="link.caption" placeholder="caption" />
                            </div>
                            <div class="form-group">
                                <label for="type">Type</label>
                                <select id="type" v-model="link.type" class="form-control">
                                    <option value="incorrect">incorrect</option>
                                    <option value="correct">correct</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-primary" @click="changeDirection">Change Direction</button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
               
            <transition name="fade">
                <div class="position-absolute btn btn-primary"
                    v-if="element && element.id !== 'final'"
                    :key="element"
                    :style="elementStyle"
                    @click.stop="edit = 'element'"
                    role="button"
                    aria-hidden="true">
                    Edit
                </div>
            </transition>
            
            <transition name="fade">
                <div class="position-absolute btn btn-primary"
                    v-if="link"
                    :key="link"
                    :style="linkStyle"
                    @click.stop="edit = 'link'"
                    role="button"
                    aria-hidden="true">
                    Edit
                </div>
            </transition>
        </section>
    `,
    props: {
        elements: Array,
        links: Array,
        element: Object,
        link: Object
    },
    data() {
        return {
            edit: null
        }
    },
    methods: {
        moveCanvas(ev) {
            draggable(ev, this.elements);
        },
        changeDirection() {
            EventBus.$emit('link.change.direction', this.link);
        }
    },
    computed: {
        elementStyle() {
            const { pos } = this.element;
            return `left: ${pos.x + 30}px; top: ${pos.y + 120}px`;
        },
        linkStyle() {
            const { origin, target } = this.link;

            return `left: ${(origin.pos.x + target.pos.x) / 2}px; top: ${(origin.pos.y + target.pos.y) / 2}px`;
        }
    }
});