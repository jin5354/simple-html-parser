import test from 'ava'
import parse from '../src/index.js'

test('basic nested', t => {

  let testHTML = `<div id="a" class='item' b=c d>
    <!-- 测试注释节点 -->
    <span>123<<<<</span>6666<<<<<
  </div>`

  let ast = parse(testHTML)

  let result = [{
    type: 'Element',
    children: [{
      type: 'Text',
      children: [],
      tag: '',
      text: '\n    ',
      attrs: {}
    }, {
      type: 'Comment',
      children: [],
      tag: '',
      text: ' 测试注释节点 ',
      attrs: {}
    }, {
      type: 'Text',
      children: [],
      tag: '',
      text: '\n    ',
      attrs: {}
    }, {
      type: 'Element',
      children: [{
        type: 'Text',
        children: [],
        tag: '',
        text: '123<<<<',
        attrs: {}
      }],
      tag: 'span',
      text: '',
      attrs: {},
    }, {
      type: 'Text',
      children: [],
      tag: '',
      text: '6666<<<<<\n  ',
      attrs: {},
    }],
    tag: 'div',
    text: '',
    attrs: {
      id: 'a',
      class: 'item',
      b: 'c',
      d: null
    }
  }]
  t.deepEqual(JSON.stringify(ast), JSON.stringify(result))
})

