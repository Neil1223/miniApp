import { PageFactory } from '.';

export interface INavigationBarParams {
  backgroundColor?: string;
  color?: 'black' | 'white';
  titleText?: string;
  loading?: boolean;
}

const onNavigationBarChange = (data: INavigationBarParams, webviewId: number) => {
  const { backgroundColor, color, titleText, loading } = data;
  const page = PageFactory.getPage(webviewId);
  if (page) {
    backgroundColor && (page.navigationBar.navigationBarBackgroundColor = backgroundColor);
    color && (page.navigationBar.navigationBarTextStyle = color);
    titleText && (page.navigationBar.navigationBarTitleText = titleText);
    if (typeof loading !== 'undefined') {
      page.navigationBar.loading = loading;
    }
  }
};

export default onNavigationBarChange;
