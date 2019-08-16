Vue.component('link-wrapper', {
    template: `
        <svg class="link-wrapper">
            <defs>
                <marker id="arrow" markerWidth="4" markerHeight="4" orient="auto" refX="13" refY="2">
                    <path d="M0 0, L4 2, L0 4, L0 0" fill="#556688"></path>
                </marker>
            </defs>
        
            <template v-for="({ id, origin, target, type, selected }, key) in links">
                <line
                    class="link"
                    :key="id"
                    :data-type="type"
                    marker-end="url(#arrow)"
                    :class="{selected: selected || origin.selected || target.selected }"
                    :x1="origin.pos.x + 50"
                    :y1="origin.pos.y + 50"
                    :x2="target.pos.x + 50"
                    :y2="target.pos.y + 50"
                    @click.stop="select(links[key])">
                </line>
            </template>
        </svg>
    `,
    props: {
        links: Array
    },
    methods: {
        select(link) {
            console.log('a');
            EventBus.$emit('select.link', link);
        }
    }
});