
const items = [
    {
        title: 'Image',
        name:'image.npy',
        position: {},
        style: {}
    },
    {
        title: '(1)',
        name: 'mask.npy',
        position: {x: 100, y: 100},
        style: {
            false: [0, 0, 0, 0],
            true: [0, 255, 0, 255]
        }
    },
    {
        title: '(2)',
        name: 'mask.npy',
        position: {x: 100, y: 200},
        style: {
            false: [0, 0, 0, 0],
            true: [255, 0, 0, 255]
        }
    },  
]

const groups = {

}

var next_group_id = 1

function activate_group(group_id)
{
    document.querySelector('.item-group.active').classList.remove('active')

    const element = document.querySelector(`[data-group-id="${group_id}"]`)
    element.classList.add('active')

    document.querySelector('#item-groups').insertBefore(document.querySelector('.active-items'), element.nextSibling)
}

function add_new_group()
{
    const div = document.createElement('div')
    div.classList.add('item-group')
    div.classList.add('active')
    div.dataset.groupId = next_group_id
    next_group_id += 1

    div.innerHTML = `Group #${div.dataset.groupId} <span class="item-menu"><a>✎</a></span>`

    document.querySelector('#item-groups').insertBefore(div, document.querySelector('#new-item-group'))

    groups[div.dataset.groupId] = []

    activate_group(div.dataset.groupId)
}

function toggle_item(item)
{
    if (item.dataset.status == 'on')
    {
        item.dataset.status = 'off'
        item.querySelector('a').innerHTML = '+'
        ItemViewer.remove(item.dataset.item)
    }
    else
    {
        item.dataset.status = 'on'
        item.querySelector('a').innerHTML = 'x'
        ItemViewer.add(JSON.parse(item.dataset.itemData))
    }
}

function setup_menu()
{
    const html = []

    items.forEach(item => {
        html.push(`<div data-status="off" class="item" data-item="${item.title}">${item.title} <span class="item-menu"><a>+</a></span></div>`)
    })

    document.querySelector('#all-items').innerHTML = html.join('')

    items.forEach(item => {
        document.querySelector(`.item[data-item="${item.title}"]`).dataset.itemData = JSON.stringify(item)
    })

    document.querySelectorAll('#all-items .item').forEach( item => {
        item.querySelector('a').addEventListener('click', _ => toggle_item(item) )
    })

    //document.querySelector('#new-item-group a').addEventListener('click', add_new_group)
}

setup_menu()