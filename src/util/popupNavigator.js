// @flow
class PopupNavigator {
  _promise: Promise<any>;
  _resolve: Function;
  _reject: Function;
  _reactNativePopupWindow: {
    open: Function,
    addOnLoadStartListener: Function,
    close: Function
  }

  constructor(reactNativePopupWindow: {
    open: Function, addOnLoadStartListener: Function, close: Function }) {
    this._reactNativePopupWindow = reactNativePopupWindow;
  }

  prepare(prepareParams: { startUrl: string }) {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    const onLoadStart = (url) => {
      if (url.indexOf(prepareParams.startUrl) === 0) {
        this._reactNativePopupWindow.close();
        this._resolve({ url });
      }
    };

    this._reactNativePopupWindow.addOnLoadStartListener(onLoadStart);

    return Promise.resolve({
      navigate: (navigateParams: { url: string }) => {
        this._reactNativePopupWindow.open(navigateParams);
        return this._promise;
      }
    });
  }
}

export default PopupNavigator;
