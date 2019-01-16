import CommentNode from './CommentNode'
import TextNode from './TextNode'
import ElementNode from './ElementNode'

const START_TAG_REG = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m
const END_TAG_REG = /^<\/([^>\s]+)[^>]*>/m
const ATTRIBUTE_REG = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm

module.exports = function parse(source: string) {
  console.log(source)

  let result: NodeList = []
  let stack = []
  let charsMode = false
  let zone = null

  stack.push(result)
  zone = result

  while(source.length > 0) {

    // 判断接下来要处理的是不是注释 <!-- 开头
    if(source.startsWith('<!--')) {
      // 找注释结尾的位置
      let endIndex = source.indexOf('-->')
      if(endIndex !== -1) {
        // 找到了，提取注释节点
        zone.push(new CommentNode(source.substring(4, endIndex)))
        source = source.substring(endIndex + 3)
      }else {
        // 若未找到，说明 <!-- 是文字内容，不是注释开头
        charsMode = true
      }
    }
    // 判断是不是 start Tag
    else if(source[0] === '<') {

    }
  }
}