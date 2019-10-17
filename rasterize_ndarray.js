
function create_canvas({x = 0, y = 0} = {})
{
    const canvas = document.createElement('canvas')
    canvas.style.left = `${x}px`
    canvas.style.top = `${y}px`
    document.querySelector('#canvas-container').appendChild(canvas)
    return canvas
}

function iterate_shape(shape, callback)
{
    const idx = []

    for (var i = 0; i < shape.length; ++i) idx[i] = 0

    for(var pixel_idx = 0;; ++pixel_idx)
    {
        callback(idx, pixel_idx)
        
        var i = shape.length-1

        idx[i] += 1

        while (idx[i] == shape[i])
        {
            if (i == 0) return

            idx[i] = 0
            i -= 1
            idx[i] += 1
        }
    }
}

function draw_mask(context, mask, colors = {})
{
    console.assert(mask.shape.length == 2, `mask.shape is ${mask.shape}`)
    
    context.canvas.width = mask.shape[1]
    context.canvas.height = mask.shape[0]

    const data = context.createImageData(mask.shape[1], mask.shape[0])

    const background = colors.false === undefined ? [0, 0, 0, 255] : colors.false
    const foreground = colors.true === undefined ? [255, 255, 255, 255] : colors.true
    
    iterate_shape(mask.shape, ([y, x], i) => {
        const val = (mask.data[i] == 1 ? foreground : background)
        data.data[4*i+0] = val[0]
        data.data[4*i+1] = val[1]
        data.data[4*i+2] = val[2]
        data.data[4*i+3] = val[3]

    }) 
    
    context.putImageData(data, 0, 0)
}

function draw_rgb_image(context, image)
{
    console.assert(image.shape.length == 3, `image.shape is ${image.shape}`)
    const [height, width, channels] = image.shape

    console.assert(channels == 3, `channels is ${channels}`)
    
    console.log(height, width)

    context.canvas.width = width
    context.canvas.height = height

    const data = context.createImageData(width, height)

    iterate_shape([height, width], ([y, x], i) => {
        data.data[4*i+0] = image.data[3*i+0]
        data.data[4*i+1] = image.data[3*i+1]
        data.data[4*i+2] = image.data[3*i+2]
        data.data[4*i+3] = 255
    })
    
    context.putImageData(data, 0, 0)
}

function f()
{
    canvas.getContext('2d')
}