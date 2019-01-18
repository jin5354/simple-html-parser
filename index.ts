import {CommentNode} from './CommentNode'
import {TextNode} from './TextNode'
import {ElementNode} from './ElementNode'

const START_TAG_REG = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m
const END_TAG_REG = /^<\/([^>\s]+)[^>]*>/m
const ATTRIBUTE_REG = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm

export type NodeList = (ElementNode|CommentNode|TextNode)[]

interface Root {
  children: NodeList
}

module.exports = function parse(source: string) {

  let result: Root = {
    children: []
  }
  let stack = []
  let charsMode = false
  let zone: any = null

  stack.push(result)
  zone = result

  while(source.length > 0) {

    console.log(source)

    // 判断接下来要处理的是不是注释 <!-- 开头
    if(source.startsWith('<!--')) {
      // 找注释结尾的位置
      let endIndex = source.indexOf('-->')
      if(endIndex !== -1) {
        // 找到了，提取注释节点
        console.log(`发现注释节点${source.substring(4, endIndex)}`)
        zone.children.push(new CommentNode(source.substring(4, endIndex)))
        source = source.substring(endIndex + 3)
      }else {
        // 若未找到，说明 <!-- 是文字内容，不是注释开头
        charsMode = true
      }
    }
    // 判断是不是 end Tag
    else if(source.startsWith('</')) {
      if(END_TAG_REG.test(source)) {
        let left = RegExp.leftContext
        let tag = RegExp.lastMatch
        let right = RegExp.rightContext

        console.log(`发现闭合标签${tag}`)
        let result = tag.match(END_TAG_REG)
        let name = result[1]

        if(name === zone.tag) {
          stack.pop()
          zone = stack[stack.length - 1]
        }else {
          throw new Error('闭合标签对不上，html 语法出错')
        }
        source = right
        return
      }else {
        // 若未找到，说明 </ 是文字内容，不是注释开头
        charsMode = true
      }
    }
    // 判断是不是 start Tag
    else if(source.charAt(0) === '<') {
      if(START_TAG_REG.test(source)) {
        let left = RegExp.leftContext
        let tag = RegExp.lastMatch
        let right = RegExp.rightContext

        let result = tag.match(START_TAG_REG)
        let tagName = result[1]
        let attrs = result[2]
        let attrAry: Attr[] = []
        // 抽取 attributes
        if(attrs) {
          attrs.replace(ATTRIBUTE_REG, (a0, a1, a2, a3, a4, a5, a6) => {
            let attrName = a1
            let attrValue = a3
            attrAry.push({
              name: attrName,
              value: attrValue || null
            })
          })
        }

        console.log(`发现元素节点${tag}`)
        let element = new ElementNode(tagName, attrAry, [])
        zone.children.push(element)
        // 如果不是自闭合 tag，入栈
        if(!tag.endsWith('/>')) {
          stack.push(element)
          zone = element
        }
        source = right
      }else {
        // 若未找到，说明 < 是文字内容，不是注释开头
        charsMode = true
      }
    }

    if(charsMode) {
      let index = source.indexOf('<')
      if(index == -1) {
        zone.children.push(new TextNode(source))
      }
    }
  }

  return result
}