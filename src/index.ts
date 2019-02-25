import {CommentNode} from './CommentNode'
import {TextNode} from './TextNode'
import {ElementNode} from './ElementNode'

const START_TAG_REG = /^<([^<>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m
const END_TAG_REG = /^<\/([^>\s]+)[^>]*>/m
const ATTRIBUTE_REG = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm

export type NodeList = (ElementNode|CommentNode|TextNode)[]

interface Root {
  children: NodeList
}

export default function parse(source: string) {

  let result: Root = {
    children: []
  }
  let stack = []
  let zone: any = null

  stack.push(result)
  zone = result

  while(source.length > 0) {

    // 判断一些节点，如果都不符合按照文本处理
    // 判断接下来要处理的是不是注释 <!-- 开头
    if(source.startsWith('<!--')) {
      // 找注释结尾的位置，找到了，就提取出注释节点
      let endIndex = source.indexOf('-->')
      if(endIndex !== -1) {
        // console.log(`发现注释节点${source.substring(4, endIndex)}`)
        zone.children.push(new CommentNode(source.substring(4, endIndex)))
        source = source.substring(endIndex + 3)
        continue
      }
    }
    // 判断是不是 end Tag
    else if(source.startsWith('</') && END_TAG_REG.test(source)) {
      let left = RegExp.leftContext
      let tag = RegExp.lastMatch
      let right = RegExp.rightContext

      //console.log(`发现闭合标签 ${tag}`)
      let result = tag.match(END_TAG_REG)
      let name = result[1]

      if(name === zone.tag) {
        stack.pop()
        zone = stack[stack.length - 1]
        // console.log('闭合，出栈')
      }else {
        throw new Error('闭合标签对不上，html 语法出错')
      }
      source = right
      continue
    }
    // 判断是不是 start Tag
    else if(source.charAt(0) === '<' && START_TAG_REG.test(source)) {
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

          return ''
        })
      }

      // console.log(`发现元素节点${tag}`)
      let element = new ElementNode(tagName, attrAry, [])
      zone.children.push(element)
      // 如果不是自闭合 tag，入栈
      if(!tag.endsWith('/>')) {
        stack.push(element)
        zone = element
      }
      source = right
      continue
    }

    // 确认为文字模式，开始识别文本节点
    // console.log('开始识别文字')
    let index = source.indexOf('<', 1)
    if(index == -1) {
      if(zone.children[zone.children.length - 1] instanceof TextNode) {
        zone.children[zone.children.length - 1].content += source
      }else {
        zone.children.push(new TextNode(source))
      }
      source = ''
    }else {
      if(zone.children[zone.children.length - 1] instanceof TextNode) {
        zone.children[zone.children.length - 1].content += source.substring(0, index)
      }else {
        zone.children.push(new TextNode(source.substring(0, index)))
      }
      source = source.substring(index)
    }
  }

  return result.children
}