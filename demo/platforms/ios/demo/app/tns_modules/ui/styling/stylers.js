var style = require("./style");
var stylersCommon = require("./stylers-common");
var enums = require("ui/enums");
var background = require("ui/styling/background");
var frame = require("ui/frame");
var types = require("utils/types");
global.moduleMerge(stylersCommon, exports);
var ignorePropertyHandler = new stylersCommon.StylePropertyChangedHandler(function (view, val) {
}, function (view, val) {
});
var DefaultStyler = (function () {
    function DefaultStyler() {
    }
    DefaultStyler.setBackgroundInternalProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = background.ios.createBackgroundUIColor(view);
        }
    };
    DefaultStyler.resetBackgroundInternalProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            nativeView.backgroundColor = nativeValue;
        }
    };
    DefaultStyler.getNativeBackgroundInternalValue = function (view) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.backgroundColor;
        }
        return undefined;
    };
    DefaultStyler.setVisibilityProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.hidden = (newValue !== enums.Visibility.visible);
        }
    };
    DefaultStyler.resetVisibilityProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.hidden = false;
        }
    };
    DefaultStyler.setOpacityProperty = function (view, newValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.alpha = newValue;
        }
    };
    DefaultStyler.resetOpacityProperty = function (view, nativeValue) {
        var nativeView = view._nativeView;
        if (nativeView) {
            return nativeView.alpha = 1.0;
        }
    };
    DefaultStyler.setBorderWidthProperty = function (view, newValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.borderWidth = newValue;
        }
    };
    DefaultStyler.resetBorderWidthProperty = function (view, nativeValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.borderWidth = nativeValue;
        }
    };
    DefaultStyler.getBorderWidthProperty = function (view) {
        if (view._nativeView instanceof UIView) {
            return view._nativeView.layer.borderWidth;
        }
        return 0;
    };
    DefaultStyler.setBorderColorProperty = function (view, newValue) {
        if (view._nativeView instanceof UIView && newValue instanceof UIColor) {
            view._nativeView.layer.borderColor = newValue.CGColor;
        }
    };
    DefaultStyler.resetBorderColorProperty = function (view, nativeValue) {
        if (view._nativeView instanceof UIView && nativeValue instanceof UIColor) {
            view._nativeView.layer.borderColor = nativeValue;
        }
    };
    DefaultStyler.getBorderColorProperty = function (view) {
        if (view._nativeView instanceof UIView) {
            return view._nativeView.layer.borderColor;
        }
        return undefined;
    };
    DefaultStyler.setBorderRadiusProperty = function (view, newValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.cornerRadius = newValue;
            view._nativeView.clipsToBounds = true;
        }
    };
    DefaultStyler.resetBorderRadiusProperty = function (view, nativeValue) {
        if (view._nativeView instanceof UIView) {
            view._nativeView.layer.cornerRadius = nativeValue;
        }
    };
    DefaultStyler.getBorderRadiusProperty = function (view) {
        if (view._nativeView instanceof UIView) {
            return view._nativeView.layer.cornerRadius;
        }
        return 0;
    };
    DefaultStyler.registerHandlers = function () {
        style.registerHandler(style.backgroundInternalProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBackgroundInternalProperty, DefaultStyler.resetBackgroundInternalProperty, DefaultStyler.getNativeBackgroundInternalValue));
        style.registerHandler(style.visibilityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setVisibilityProperty, DefaultStyler.resetVisibilityProperty));
        style.registerHandler(style.opacityProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setOpacityProperty, DefaultStyler.resetOpacityProperty));
        style.registerHandler(style.borderWidthProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBorderWidthProperty, DefaultStyler.resetBorderWidthProperty, DefaultStyler.getBorderWidthProperty));
        style.registerHandler(style.borderColorProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBorderColorProperty, DefaultStyler.resetBorderColorProperty, DefaultStyler.getBorderColorProperty));
        style.registerHandler(style.borderRadiusProperty, new stylersCommon.StylePropertyChangedHandler(DefaultStyler.setBorderRadiusProperty, DefaultStyler.resetBorderRadiusProperty, DefaultStyler.getBorderRadiusProperty));
    };
    return DefaultStyler;
})();
exports.DefaultStyler = DefaultStyler;
var ButtonStyler = (function () {
    function ButtonStyler() {
    }
    ButtonStyler.setColorProperty = function (view, newValue) {
        var btn = view._nativeView;
        btn.setTitleColorForState(newValue, UIControlState.UIControlStateNormal);
    };
    ButtonStyler.resetColorProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        btn.setTitleColorForState(nativeValue, UIControlState.UIControlStateNormal);
    };
    ButtonStyler.getNativeColorValue = function (view) {
        var btn = view._nativeView;
        return btn.titleColorForState(UIControlState.UIControlStateNormal);
    };
    ButtonStyler.setFontInternalProperty = function (view, newValue, nativeValue) {
        var btn = view._nativeView;
        btn.titleLabel.font = newValue.getUIFont(nativeValue);
    };
    ButtonStyler.resetFontInternalProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        btn.titleLabel.font = nativeValue;
    };
    ButtonStyler.getNativeFontInternalValue = function (view) {
        var btn = view._nativeView;
        return btn.titleLabel.font;
    };
    ButtonStyler.setTextAlignmentProperty = function (view, newValue) {
        var btn = view._nativeView;
        setTextAlignment(btn.titleLabel, newValue);
        switch (newValue) {
            case enums.TextAlignment.left:
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignment.UIControlContentHorizontalAlignmentLeft;
                break;
            case enums.TextAlignment.center:
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignment.UIControlContentHorizontalAlignmentCenter;
                break;
            case enums.TextAlignment.right:
                btn.contentHorizontalAlignment = UIControlContentHorizontalAlignment.UIControlContentHorizontalAlignmentRight;
                break;
            default:
                break;
        }
    };
    ButtonStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var btn = view._nativeView;
        btn.titleLabel.textAlignment = nativeValue.textAlign;
        btn.contentHorizontalAlignment = nativeValue.contentAlign;
    };
    ButtonStyler.getNativeTextAlignmentValue = function (view) {
        var btn = view._nativeView;
        return {
            textAlign: btn.titleLabel.textAlignment,
            contentAlign: btn.contentHorizontalAlignment
        };
    };
    ButtonStyler.setPaddingProperty = function (view, newValue) {
        var top = newValue.top + view.borderWidth;
        var left = newValue.left + view.borderWidth;
        var bottom = newValue.bottom + view.borderWidth;
        var right = newValue.right + view.borderWidth;
        view._nativeView.contentEdgeInsets = UIEdgeInsetsFromString("{" + top + "," + left + "," + bottom + "," + right + "}");
    };
    ButtonStyler.resetPaddingProperty = function (view, nativeValue) {
        view._nativeView.contentEdgeInsets = UIEdgeInsetsFromString("{0,0,0,0}");
    };
    ButtonStyler.setTextDecorationProperty = function (view, newValue) {
        setTextDecoration(view.ios.titleLabel, newValue);
    };
    ButtonStyler.resetTextDecorationProperty = function (view, nativeValue) {
        setTextDecoration(view.ios.titleLabel, enums.TextDecoration.none);
    };
    ButtonStyler.setWhiteSpaceProperty = function (view, newValue) {
        setWhiteSpace(view.ios.titleLabel, newValue, view.ios);
    };
    ButtonStyler.resetWhiteSpaceProperty = function (view, nativeValue) {
        setWhiteSpace(view.ios.titleLabel, enums.WhiteSpace.normal, view.ios);
    };
    ButtonStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setColorProperty, ButtonStyler.resetColorProperty, ButtonStyler.getNativeColorValue), "Button");
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setFontInternalProperty, ButtonStyler.resetFontInternalProperty, ButtonStyler.getNativeFontInternalValue), "Button");
        style.registerHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setTextAlignmentProperty, ButtonStyler.resetTextAlignmentProperty, ButtonStyler.getNativeTextAlignmentValue), "Button");
        style.registerHandler(style.nativePaddingsProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setPaddingProperty, ButtonStyler.resetPaddingProperty), "Button");
        style.registerHandler(style.textDecorationProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setTextDecorationProperty, ButtonStyler.resetTextDecorationProperty), "Button");
        style.registerHandler(style.whiteSpaceProperty, new stylersCommon.StylePropertyChangedHandler(ButtonStyler.setWhiteSpaceProperty, ButtonStyler.resetWhiteSpaceProperty), "Button");
    };
    return ButtonStyler;
})();
exports.ButtonStyler = ButtonStyler;
var TextBaseStyler = (function () {
    function TextBaseStyler() {
    }
    TextBaseStyler.setFontInternalProperty = function (view, newValue, nativeValue) {
        var ios = view._nativeView;
        ios.font = newValue.getUIFont(nativeValue);
    };
    TextBaseStyler.resetFontInternalProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        ios.font = nativeValue;
    };
    TextBaseStyler.getNativeFontInternalValue = function (view) {
        var ios = view._nativeView;
        return ios.font;
    };
    TextBaseStyler.setTextAlignmentProperty = function (view, newValue) {
        setTextAlignment(view._nativeView, newValue);
    };
    TextBaseStyler.resetTextAlignmentProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        ios.textAlignment = nativeValue;
    };
    TextBaseStyler.getNativeTextAlignmentValue = function (view) {
        var ios = view._nativeView;
        return ios.textAlignment;
    };
    TextBaseStyler.setTextDecorationProperty = function (view, newValue) {
        setTextDecoration(view._nativeView, newValue);
    };
    TextBaseStyler.resetTextDecorationProperty = function (view, nativeValue) {
        setTextDecoration(view._nativeView, enums.TextDecoration.none);
    };
    TextBaseStyler.setWhiteSpaceProperty = function (view, newValue) {
        setWhiteSpace(view._nativeView, newValue);
    };
    TextBaseStyler.resetWhiteSpaceProperty = function (view, nativeValue) {
        setWhiteSpace(view._nativeView, enums.WhiteSpace.normal);
    };
    TextBaseStyler.setColorProperty = function (view, newValue) {
        var ios = view._nativeView;
        ios.textColor = newValue;
    };
    TextBaseStyler.resetColorProperty = function (view, nativeValue) {
        var ios = view._nativeView;
        ios.textColor = nativeValue;
    };
    TextBaseStyler.getNativeColorValue = function (view) {
        var ios = view._nativeView;
        return ios.textColor;
    };
    TextBaseStyler.registerHandlers = function () {
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setFontInternalProperty, TextBaseStyler.resetFontInternalProperty, TextBaseStyler.getNativeFontInternalValue), "TextBase");
        style.registerHandler(style.textAlignmentProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setTextAlignmentProperty, TextBaseStyler.resetTextAlignmentProperty, TextBaseStyler.getNativeTextAlignmentValue), "TextBase");
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setColorProperty, TextBaseStyler.resetColorProperty, TextBaseStyler.getNativeColorValue), "TextBase");
        style.registerHandler(style.textDecorationProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setTextDecorationProperty, TextBaseStyler.resetTextDecorationProperty), "TextBase");
        style.registerHandler(style.whiteSpaceProperty, new stylersCommon.StylePropertyChangedHandler(TextBaseStyler.setWhiteSpaceProperty, TextBaseStyler.resetWhiteSpaceProperty), "TextBase");
    };
    return TextBaseStyler;
})();
exports.TextBaseStyler = TextBaseStyler;
var TextViewStyler = (function () {
    function TextViewStyler() {
    }
    TextViewStyler.setColorProperty = function (view, newValue) {
        var textView = view._nativeView;
        TextViewStyler._setTextViewColor(textView, newValue);
    };
    TextViewStyler.resetColorProperty = function (view, nativeValue) {
        var textView = view._nativeView;
        TextViewStyler._setTextViewColor(textView, nativeValue);
    };
    TextViewStyler._setTextViewColor = function (textView, newValue) {
        var color = newValue;
        if (textView.isShowingHint && color) {
            textView.textColor = color.colorWithAlphaComponent(0.22);
        }
        else {
            textView.textColor = color;
            textView.tintColor = color;
        }
    };
    TextViewStyler.getNativeColorValue = function (view) {
        var textView = view._nativeView;
        if (textView.isShowingHint && textView.textColor) {
            return textView.textColor.colorWithAlphaComponent(1);
        }
        else {
            return textView.textColor;
        }
    };
    TextViewStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextViewStyler.setColorProperty, TextViewStyler.resetColorProperty, TextViewStyler.getNativeColorValue), "TextView");
    };
    return TextViewStyler;
})();
exports.TextViewStyler = TextViewStyler;
var TextFieldStyler = (function () {
    function TextFieldStyler() {
    }
    TextFieldStyler.setColorProperty = function (view, newValue) {
        var tf = view._nativeView;
        TextFieldStyler._setTextFieldColor(tf, newValue);
    };
    TextFieldStyler.resetColorProperty = function (view, nativeValue) {
        var tf = view._nativeView;
        TextFieldStyler._setTextFieldColor(tf, nativeValue);
    };
    TextFieldStyler._setTextFieldColor = function (tf, newValue) {
        var color = newValue;
        if (tf.isShowingHint && color) {
            tf.textColor = color.colorWithAlphaComponent(0.22);
        }
        else {
            tf.textColor = color;
            tf.tintColor = color;
        }
    };
    TextFieldStyler.getNativeColorValue = function (view) {
        var tf = view._nativeView;
        return tf.tintColor;
    };
    TextFieldStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TextFieldStyler.setColorProperty, TextFieldStyler.resetColorProperty, TextFieldStyler.getNativeColorValue), "TextField");
    };
    return TextFieldStyler;
})();
exports.TextFieldStyler = TextFieldStyler;
var SegmentedBarStyler = (function () {
    function SegmentedBarStyler() {
    }
    SegmentedBarStyler.setColorProperty = function (view, newValue) {
        var bar = view.ios;
        var currentAttrs = bar.titleTextAttributesForState(UIControlState.UIControlStateNormal);
        var attrs;
        if (currentAttrs) {
            attrs = currentAttrs.mutableCopy();
        }
        else {
            attrs = NSMutableDictionary.new();
        }
        attrs.setValueForKey(newValue, NSForegroundColorAttributeName);
        bar.setTitleTextAttributesForState(attrs, UIControlState.UIControlStateNormal);
    };
    SegmentedBarStyler.resetColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        var currentAttrs = bar.titleTextAttributesForState(UIControlState.UIControlStateNormal);
        var attrs;
        if (currentAttrs) {
            attrs = currentAttrs.mutableCopy();
        }
        else {
            attrs = NSMutableDictionary.new();
        }
        attrs.setValueForKey(nativeValue, NSForegroundColorAttributeName);
        bar.setTitleTextAttributesForState(attrs, UIControlState.UIControlStateNormal);
    };
    SegmentedBarStyler.setFontInternalProperty = function (view, newValue) {
        var bar = view.ios;
        var currentAttrs = bar.titleTextAttributesForState(UIControlState.UIControlStateNormal);
        var attrs;
        if (currentAttrs) {
            attrs = currentAttrs.mutableCopy();
        }
        else {
            attrs = NSMutableDictionary.new();
        }
        var newFont = newValue.getUIFont(UIFont.systemFontOfSize(UIFont.labelFontSize()));
        attrs.setValueForKey(newFont, NSFontAttributeName);
        bar.setTitleTextAttributesForState(attrs, UIControlState.UIControlStateNormal);
    };
    SegmentedBarStyler.resetFontInternalProperty = function (view, nativeValue) {
        var bar = view.ios;
        var currentAttrs = bar.titleTextAttributesForState(UIControlState.UIControlStateNormal);
        var attrs;
        if (currentAttrs) {
            attrs = currentAttrs.mutableCopy();
        }
        else {
            attrs = NSMutableDictionary.new();
        }
        attrs.setValueForKey(nativeValue, NSFontAttributeName);
        bar.setTitleTextAttributesForState(attrs, UIControlState.UIControlStateNormal);
    };
    SegmentedBarStyler.getNativeFontValue = function (view) {
        var bar = view.ios;
        var currentAttrs = bar.titleTextAttributesForState(UIControlState.UIControlStateNormal);
        var currentFont;
        if (currentAttrs) {
            currentFont = currentAttrs.objectForKey(NSFontAttributeName);
        }
        if (!currentFont) {
            currentFont = UIFont.systemFontOfSize(UIFont.labelFontSize());
        }
        return currentFont;
    };
    SegmentedBarStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(SegmentedBarStyler.setColorProperty, SegmentedBarStyler.resetColorProperty), "SegmentedBar");
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(SegmentedBarStyler.setFontInternalProperty, SegmentedBarStyler.resetFontInternalProperty, SegmentedBarStyler.getNativeFontValue), "SegmentedBar");
    };
    return SegmentedBarStyler;
})();
exports.SegmentedBarStyler = SegmentedBarStyler;
var ActivityIndicatorStyler = (function () {
    function ActivityIndicatorStyler() {
    }
    ActivityIndicatorStyler.setColorProperty = function (view, newValue) {
        var bar = view.ios;
        bar.color = newValue;
    };
    ActivityIndicatorStyler.resetColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        bar.color = nativeValue;
    };
    ActivityIndicatorStyler.getNativeColorValue = function (view) {
        var bar = view.ios;
        return bar.color;
    };
    ActivityIndicatorStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(ActivityIndicatorStyler.setColorProperty, ActivityIndicatorStyler.resetColorProperty, ActivityIndicatorStyler.getNativeColorValue), "ActivityIndicator");
    };
    return ActivityIndicatorStyler;
})();
exports.ActivityIndicatorStyler = ActivityIndicatorStyler;
var SliderStyler = (function () {
    function SliderStyler() {
    }
    SliderStyler.setColorProperty = function (view, newValue) {
        var bar = view.ios;
        bar.thumbTintColor = newValue;
    };
    SliderStyler.resetColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        bar.thumbTintColor = nativeValue;
    };
    SliderStyler.getNativeColorValue = function (view) {
        var bar = view.ios;
        return bar.thumbTintColor;
    };
    SliderStyler.setBackgroundColorProperty = function (view, newValue) {
        var bar = view.ios;
        bar.minimumTrackTintColor = newValue;
    };
    SliderStyler.resetBackgroundColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        bar.minimumTrackTintColor = nativeValue;
    };
    SliderStyler.getBackgroundColorProperty = function (view) {
        var bar = view.ios;
        return bar.minimumTrackTintColor;
    };
    SliderStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(SliderStyler.setColorProperty, SliderStyler.resetColorProperty, SliderStyler.getNativeColorValue), "Slider");
        style.registerHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(SliderStyler.setBackgroundColorProperty, SliderStyler.resetBackgroundColorProperty, SliderStyler.getBackgroundColorProperty), "Slider");
        style.registerHandler(style.backgroundInternalProperty, ignorePropertyHandler, "Slider");
    };
    return SliderStyler;
})();
exports.SliderStyler = SliderStyler;
var ProgressStyler = (function () {
    function ProgressStyler() {
    }
    ProgressStyler.setColorProperty = function (view, newValue) {
        var bar = view.ios;
        bar.progressTintColor = newValue;
    };
    ProgressStyler.resetColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        bar.progressTintColor = nativeValue;
    };
    ProgressStyler.getNativeColorValue = function (view) {
        var bar = view.ios;
        return bar.progressTintColor;
    };
    ProgressStyler.setBackgroundColorProperty = function (view, newValue) {
        var bar = view.ios;
        bar.trackTintColor = newValue;
    };
    ProgressStyler.resetBackgroundColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        bar.trackTintColor = nativeValue;
    };
    ProgressStyler.getBackgroundColorProperty = function (view) {
        var bar = view.ios;
        return bar.trackTintColor;
    };
    ProgressStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(ProgressStyler.setColorProperty, ProgressStyler.resetColorProperty, ProgressStyler.getNativeColorValue), "Progress");
        style.registerHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(ProgressStyler.setBackgroundColorProperty, ProgressStyler.resetBackgroundColorProperty, ProgressStyler.getBackgroundColorProperty), "Progress");
    };
    return ProgressStyler;
})();
exports.ProgressStyler = ProgressStyler;
var SwitchStyler = (function () {
    function SwitchStyler() {
    }
    SwitchStyler.setColorProperty = function (view, newValue) {
        var sw = view.ios;
        sw.thumbTintColor = newValue;
    };
    SwitchStyler.resetColorProperty = function (view, nativeValue) {
        var sw = view.ios;
        sw.thumbTintColor = nativeValue;
    };
    SwitchStyler.getNativeColorValue = function (view) {
        var sw = view.ios;
        return sw.thumbTintColor;
    };
    SwitchStyler.setBackgroundColorProperty = function (view, newValue) {
        var sw = view.ios;
        sw.onTintColor = view.backgroundColor.ios;
    };
    SwitchStyler.resetBackgroundColorProperty = function (view, nativeValue) {
        var sw = view.ios;
        sw.onTintColor = nativeValue;
    };
    SwitchStyler.getBackgroundColorProperty = function (view) {
        var sw = view.ios;
        return sw.onTintColor;
    };
    SwitchStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(SwitchStyler.setColorProperty, SwitchStyler.resetColorProperty, SwitchStyler.getNativeColorValue), "Switch");
        style.registerHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(SwitchStyler.setBackgroundColorProperty, SwitchStyler.resetBackgroundColorProperty, SwitchStyler.getBackgroundColorProperty), "Switch");
        style.registerHandler(style.backgroundInternalProperty, ignorePropertyHandler, "Switch");
    };
    return SwitchStyler;
})();
exports.SwitchStyler = SwitchStyler;
var SearchBarStyler = (function () {
    function SearchBarStyler() {
    }
    SearchBarStyler.setBackgroundColorProperty = function (view, newValue) {
        var bar = view.ios;
        bar.barTintColor = newValue;
    };
    SearchBarStyler.getBackgroundColorProperty = function (view) {
        var bar = view.ios;
        return bar.barTintColor;
    };
    SearchBarStyler.resetBackgroundColorProperty = function (view, nativeValue) {
        var bar = view.ios;
        bar.barTintColor = nativeValue;
    };
    SearchBarStyler.getColorProperty = function (view) {
        var sf = view._textField;
        if (sf) {
            return sf.textColor;
        }
        return undefined;
    };
    SearchBarStyler.setColorProperty = function (view, newValue) {
        var sf = view._textField;
        if (sf) {
            sf.textColor = newValue;
            sf.tintColor = newValue;
        }
    };
    SearchBarStyler.resetColorProperty = function (view, nativeValue) {
        var sf = view._textField;
        if (sf) {
            sf.textColor = nativeValue;
            sf.tintColor = nativeValue;
        }
    };
    SearchBarStyler.setFontInternalProperty = function (view, newValue, nativeValue) {
        var sf = view._textField;
        if (sf) {
            sf.font = newValue.getUIFont(nativeValue);
        }
    };
    SearchBarStyler.resetFontInternalProperty = function (view, nativeValue) {
        var sf = view._textField;
        if (sf) {
            sf.font = nativeValue;
        }
    };
    SearchBarStyler.getNativeFontInternalValue = function (view) {
        var sf = view._textField;
        if (sf) {
            return sf.font;
        }
        return undefined;
    };
    SearchBarStyler.registerHandlers = function () {
        style.registerHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(SearchBarStyler.setBackgroundColorProperty, SearchBarStyler.resetBackgroundColorProperty, SearchBarStyler.getBackgroundColorProperty), "SearchBar");
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(SearchBarStyler.setColorProperty, SearchBarStyler.resetColorProperty, SearchBarStyler.getColorProperty), "SearchBar");
        style.registerHandler(style.fontInternalProperty, new stylersCommon.StylePropertyChangedHandler(SearchBarStyler.setFontInternalProperty, SearchBarStyler.resetFontInternalProperty, SearchBarStyler.getNativeFontInternalValue), "SearchBar");
    };
    return SearchBarStyler;
})();
exports.SearchBarStyler = SearchBarStyler;
var ActionBarStyler = (function () {
    function ActionBarStyler() {
    }
    ActionBarStyler.setColorProperty = function (view, newValue) {
        var topFrame = frame.topmost();
        if (topFrame) {
            var navBar = topFrame.ios.controller.navigationBar;
            navBar.titleTextAttributes = (_a = {}, _a[NSForegroundColorAttributeName] = newValue, _a);
            navBar.tintColor = newValue;
        }
        var _a;
    };
    ActionBarStyler.resetColorProperty = function (view, nativeValue) {
        var topFrame = frame.topmost();
        if (topFrame) {
            var navBar = topFrame.ios.controller.navigationBar;
            navBar.titleTextAttributes = null;
            navBar.tintColor = null;
        }
    };
    ActionBarStyler.setBackgroundColorProperty = function (view, newValue) {
        var topFrame = frame.topmost();
        if (topFrame) {
            var navBar = topFrame.ios.controller.navigationBar;
            navBar.barTintColor = newValue;
        }
    };
    ActionBarStyler.resetBackgroundColorProperty = function (view, nativeValue) {
        var topFrame = frame.topmost();
        if (topFrame) {
            var navBar = topFrame.ios.controller.navigationBar;
            navBar.barTintColor = null;
        }
    };
    ActionBarStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(ActionBarStyler.setColorProperty, ActionBarStyler.resetColorProperty), "ActionBar");
        style.registerHandler(style.backgroundColorProperty, new stylersCommon.StylePropertyChangedHandler(ActionBarStyler.setBackgroundColorProperty, ActionBarStyler.resetBackgroundColorProperty), "ActionBar");
        style.registerHandler(style.backgroundInternalProperty, ignorePropertyHandler, "ActionBar");
    };
    return ActionBarStyler;
})();
exports.ActionBarStyler = ActionBarStyler;
var TabViewStyler = (function () {
    function TabViewStyler() {
    }
    TabViewStyler.setColorProperty = function (view, newValue) {
        var tab = view;
        tab._updateIOSTabBarColors();
    };
    TabViewStyler.resetColorProperty = function (view, nativeValue) {
        var tab = view;
        tab._updateIOSTabBarColors();
    };
    TabViewStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TabViewStyler.setColorProperty, TabViewStyler.resetColorProperty), "TabView");
    };
    return TabViewStyler;
})();
exports.TabViewStyler = TabViewStyler;
var DatePickerStyler = (function () {
    function DatePickerStyler() {
    }
    DatePickerStyler.setColorProperty = function (view, newValue) {
        var picker = view._nativeView;
        picker.setValueForKey(newValue, "textColor");
    };
    DatePickerStyler.resetColorProperty = function (view, nativeValue) {
        var picker = view._nativeView;
        picker.setValueForKey(nativeValue, "textColor");
    };
    DatePickerStyler.getColorProperty = function (view) {
        var picker = view._nativeView;
        return picker.valueForKey("textColor");
    };
    DatePickerStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(DatePickerStyler.setColorProperty, DatePickerStyler.resetColorProperty, DatePickerStyler.getColorProperty), "DatePicker");
    };
    return DatePickerStyler;
})();
exports.DatePickerStyler = DatePickerStyler;
var TimePickerStyler = (function () {
    function TimePickerStyler() {
    }
    TimePickerStyler.setColorProperty = function (view, newValue) {
        var picker = view._nativeView;
        picker.setValueForKey(newValue, "textColor");
    };
    TimePickerStyler.resetColorProperty = function (view, nativeValue) {
        var picker = view._nativeView;
        picker.setValueForKey(nativeValue, "textColor");
    };
    TimePickerStyler.getColorProperty = function (view) {
        var picker = view._nativeView;
        return picker.valueForKey("textColor");
    };
    TimePickerStyler.registerHandlers = function () {
        style.registerHandler(style.colorProperty, new stylersCommon.StylePropertyChangedHandler(TimePickerStyler.setColorProperty, TimePickerStyler.resetColorProperty, TimePickerStyler.getColorProperty), "TimePicker");
    };
    return TimePickerStyler;
})();
exports.TimePickerStyler = TimePickerStyler;
function setTextAlignment(view, value) {
    switch (value) {
        case enums.TextAlignment.left:
            view.textAlignment = NSTextAlignment.NSTextAlignmentLeft;
            break;
        case enums.TextAlignment.center:
            view.textAlignment = NSTextAlignment.NSTextAlignmentCenter;
            break;
        case enums.TextAlignment.right:
            view.textAlignment = NSTextAlignment.NSTextAlignmentRight;
            break;
        default:
            break;
    }
}
function setTextDecoration(view, value) {
    var attributes = NSMutableDictionary.alloc().init();
    var values = (value + "").split(" ");
    if (values.indexOf(enums.TextDecoration.underline) !== -1) {
        attributes.setObjectForKey(NSUnderlineStyle.NSUnderlineStyleSingle, NSUnderlineStyleAttributeName);
    }
    if (values.indexOf(enums.TextDecoration.lineThrough) !== -1) {
        attributes.setObjectForKey(NSUnderlineStyle.NSUnderlineStyleSingle, NSStrikethroughStyleAttributeName);
    }
    if (values.indexOf(enums.TextDecoration.none) === -1) {
        setTextDecorationNative(view, view.text || view.attributedText, attributes);
    }
    else {
        setTextDecorationNative(view, view.text || view.attributedText, NSMutableDictionary.alloc().init());
    }
}
function setWhiteSpace(view, value, parentView) {
    if (value === enums.WhiteSpace.normal) {
        view.lineBreakMode = NSLineBreakMode.NSLineBreakByWordWrapping;
        view.numberOfLines = 0;
    }
    else {
        if (parentView) {
            view.lineBreakMode = NSLineBreakMode.NSLineBreakByTruncatingMiddle;
        }
        else {
            view.lineBreakMode = NSLineBreakMode.NSLineBreakByTruncatingTail;
        }
        view.numberOfLines = 1;
    }
}
function setTextDecorationNative(view, value, attributes) {
    var attributedString;
    if (value instanceof NSAttributedString) {
        attributedString = NSMutableAttributedString.alloc().initWithAttributedString(value);
        attributedString.addAttributesRange(attributes, NSRangeFromString(attributedString.string));
    }
    else {
        view.attributedText = NSAttributedString.alloc().initWithStringAttributes(types.isString(value) ? value : "", attributes);
    }
}
function _registerDefaultStylers() {
    style.registerNoStylingClass("Frame");
    DefaultStyler.registerHandlers();
    TextBaseStyler.registerHandlers();
    ButtonStyler.registerHandlers();
    TextViewStyler.registerHandlers();
    SegmentedBarStyler.registerHandlers();
    SearchBarStyler.registerHandlers();
    ActionBarStyler.registerHandlers();
    TabViewStyler.registerHandlers();
    ProgressStyler.registerHandlers();
    SwitchStyler.registerHandlers();
    TextFieldStyler.registerHandlers();
    ActivityIndicatorStyler.registerHandlers();
    SliderStyler.registerHandlers();
    DatePickerStyler.registerHandlers();
    TimePickerStyler.registerHandlers();
}
exports._registerDefaultStylers = _registerDefaultStylers;
