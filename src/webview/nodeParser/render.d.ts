export type CreateIVirtualDomFunc = (props: any) => IVirtualDom;

export interface IVirtualDom {
  tag: string | CreateIVirtualDomFunc;
  props: { [key: string]: any };
  children: any[];
}
