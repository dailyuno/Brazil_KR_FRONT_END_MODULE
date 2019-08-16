Vue.component('element-wrapper', {
    template: `
        <div class="element-wrapper">
            <template v-for="({ selected, clone, pos, id }, key) in elements">
                <div class="element"
                    :data-id="id"
                    :key="id"
                    :class="{selected, clone}"
                    :style="{left: pos.x + 'px', top: pos.y + 'px'}"
                    @mousedown="dragOrClone($event, elements[key])"
                    @mouseup="saveClone($event, elements[key])"
                    @click.stop="select(elements[key])">
                    <span v-if="id === 'begin' || id === 'final'">{{ id }}</span>
                </div>
            </template>
        </div>
    `,
    props: {
        elements: Array
    },
    methods: {
        dragOrClone(ev, element) {
            if (ev.shiftKey) {
                ev.stopPropagation();
                EventBus.$emit('make.clone', ev, element);
            } else {
                draggable(ev, element);
            }
        },
        saveClone(ev, element) {
            EventBus.$emit('save.clone', ev, element);
        },
        select(element) {
            EventBus.$emit('select.element', element);
        }
    }
});