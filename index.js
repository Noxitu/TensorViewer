/*NumpyLoader.ajax('./data/image.npy', data => {
    const canvas = create_canvas()
    canvas.style.zIndex = 1
    const context = canvas.getContext('2d')
    draw_rgb_image(context, data)
})

NumpyLoader.ajax('./data/mask.npy', data => {
    const canvas = create_canvas({x: 10})
    canvas.style.zIndex = 2
    const context = canvas.getContext('2d')
    draw_mask(context, data, {false: [0, 0, 0, 0], true: [255, 0, 0, 255]})
})*/

const ItemViewer = {
    add: function(item)
    {
        NumpyLoader.ajax(`./data/${item.name}`, data => {
            const canvas = create_canvas(item.position)
            canvas.style.zIndex = ItemViewer.next_z_index
            ItemViewer.next_z_index += 1

            canvas.dataset.data_name = item.title

            const context = canvas.getContext('2d')

            if (data.dtype == 'bool')
                draw_mask(context, data, item.style)
            else if (data.dtype == 'uint8')
                draw_rgb_image(context, data)
        })
    },

    remove: function(name)
    {
        document.querySelectorAll(`canvas[data-data_name="${name}"]`).forEach( element => {
            element.remove()
        })
    },

    next_z_index: 2
}


function setup() {
    const outer = document.querySelector('#display-area')
    const inner = document.querySelector('#canvas-container')
    const locator = document.querySelector('#locator')

    inner.style.top = '0px'
    inner.style.left = '0px'
    inner.style.zoom = '1'

    console.log(inner.style.zoom)

    function number(pos) { return pos.substr(0, pos.length-2)*1 }

    var dragging = false

    outer.addEventListener('wheel', function(ev) {
        const mouse_x = ev.clientX - locator.getBoundingClientRect().left
        const mouse_y = ev.clientY - locator.getBoundingClientRect().top

        const x = number(inner.style.left)
        const y = number(inner.style.top)
        var zoom = inner.style.zoom

        const old_x = mouse_x / zoom - x
        const old_y = mouse_y / zoom - y

        if (ev.deltaY < 0)
            zoom *= 1.1
        if (ev.deltaY > 0)
            zoom /= 1.1

        const new_x = mouse_x / zoom - x
        const new_y = mouse_y / zoom - y

        const target_x = x + (new_x - old_x) 
        const target_y = y + (new_y - old_y)

        inner.style.left = `${target_x}px`
        inner.style.top = `${target_y}px`
        inner.style.zoom = zoom

        ev.preventDefault()
    })

    outer.addEventListener('mousedown', function(ev) {
        dragging = {
            x: number(inner.style.left) - ev.clientX/inner.style.zoom, 
            y: number(inner.style.top) - ev.clientY/inner.style.zoom
        }

        document.body.classList.add('dragging')
    })

    document.body.addEventListener('mousemove', function(ev) {
        if (dragging === false) return
        
        inner.style.top = `${ev.clientY/inner.style.zoom + dragging.y}px`
        inner.style.left = `${ev.clientX/inner.style.zoom + dragging.x}px`
    })

    document.body.addEventListener('mouseup', function(ev) {
        dragging = false
        document.body.classList.remove('dragging')
    })
}
    
setup()