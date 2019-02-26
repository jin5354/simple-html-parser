import test from 'ava'
import parse from '../src/index.js'

test('basic nested', t => {

  let testHTML = `<div id="a" class='item' b=c d>
    <!-- 测试注释节点 -->
    <span>123<<<<</span>6666<<<<<
  </div>`

  let ast = parse(testHTML)

  let result = [{
    tag: 'div',
    attrs: [{
      name: 'id',
      value: 'a',
      wrap: '"'
    }, {
      name: 'class',
      value: 'item',
      wrap: "'"
    }, {
      name: 'b',
      value: 'c',
      wrap: ''
    }, {
      name: 'd',
      value: null,
      wrap: ''
    }],
    children: [{
      content: '\n    ',
    }, {
      content: ' 测试注释节点 '
    }, {
      content: '\n    '
    }, {
      tag: 'span',
      attrs: [],
      children: [{
        content: '123<<<<',
      }]
    }, {
      content: '6666<<<<<\n  '
    }]
  }]
  t.deepEqual(JSON.stringify(ast), JSON.stringify(result))
})

