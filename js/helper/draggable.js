const draggable = ({ pageX, pageY }, items) => {
    const dragItems = Array.isArray(items) ? items : [items];
    const drag = {x: pageX, y: pageY};

    const dragmove = ({ pageX, pageY }) => {
        dragItems.forEach(x => {
            x.pos.x -= drag.x - pageX;
            x.pos.y -= drag.y - pageY;
        });

        drag.x = pageX;
        drag.y = pageY;
    };

    const dragend = () => {
        document.removeEventListener('mousemove', dragmove);
        document.removeEventListener('mouseup', dragend);
    };

    document.addEventListener('mousemove', dragmove);
    document.addEventListener('mouseup', dragend);
};