import {ElementNode} from '../ElementNode'
import {CommentNode} from '../CommentNode'
import {TextNode} from '../TextNode'

interface Attr {
  key: string,
  value: string
}

type NodeList = (ElementNode|CommentNode|TextNode)[]