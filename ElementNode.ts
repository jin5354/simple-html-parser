import {NodeList} from './index'

export class ElementNode {
  tag: string
  attrs: Attr[]
  children: NodeList

  constructor(tag: string, attrs: Attr[], children: NodeList) {
    this.tag = tag
    this.attrs = attrs
    this.children = children
  }
}