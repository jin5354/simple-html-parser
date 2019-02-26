interface Attr {
  name: string,
  value: string,
  wrap?: '"' | "'" | ''
}

interface RegExpConstructor {
  leftContext: string,
  rightContext: string
}