export interface IParsedButton {
  props: IProps,
  styles: string,
  text: string
}

type IProps = {
  size?: 'small' | 'medium' | 'large',
  type: 'primary' | 'secondary' | 'success' | 'warning'
}
