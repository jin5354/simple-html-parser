import test from 'ava'
import parse from '../src/index'

test('basic nested', t => {

  let testHTML = `<div id="a" b=c d>
    <!-- 测试注释节点 -->
    <span>123<<<<</span>6666<<<<<
  </div>`

  let ast = parse(testHTML)

  let result = [{
    tag: 'div',
    attrs: [{
      name: 'id',
      value: '"a"'
    }, {
      name: 'b',
      value: 'c'
    }, {
      name: 'd',
      value: null
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

