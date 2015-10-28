/**
 * OpenLayers 3 Map scale control with scale line and scale string.
 *
 * @author Vladimir Vershinin (https://github.com/ghettovoice)
 * @version 1.0.0
 * @license MIT https://opensource.org/licenses/MIT
 * @copyright (c) 2015, Vladimir Vershinin https://github.com/ghettovoice
 */
/**
 * @param {Object} options
 * @constructor
 * @extends ol.control.Control
 */
ol.control.MapScale = function(options) {
    options || (options = {});

    var className = options.className !== undefined ? options.className : 'ol-map-scale';

    var element = document.createElement("div");
    element.classList.add(className);

    var scaleLine = document.createElement("div");
    element.appendChild(scaleLine);

    /**
     * @type {ol.control.ScaleLine}
     * @protected
     */
    this.scaleLine_ = new ol.control.ScaleLine({
        target: scaleLine,
        className: "ol-map-scale-line"
    });

    /**
     * @type {Element}
     * @protected
     */
    this.scaleValue_ = document.createElement("div");
    this.scaleValue_.classList.add(className + "-value");
    element.appendChild(this.scaleValue_);

    /**
     * @protected
     * @type {?olx.ViewState}
     */
    this.viewState_ = null;

    var render = options.render !== undefined ? options.render : ol.control.MapScale.render;

    ol.control.Control.call(this, {
        element: element,
        render: render,
        target: options.target
    });

    this.scaleLine_.on("change:units", this.handleUnitsChanged_, this);
};
ol.inherits(ol.control.MapScale, ol.control.Control);

/**
 * @const {number}
 */
ol.control.MapScale.DOTS_PER_INCH = ol.control.MapScale.calcDPI() || 96;

/**
 * @const {number}
 */
ol.control.MapScale.INCHES_PER_METER = 39.37;

/**
 * Calculates screen DPI based on css style
 * @returns {number|undefined}
 * @private
 */
ol.control.MapScale.calcDPI = function() {
    if (!document) {
        return;
    }

    var inch = document.createElement("div"),
        dpi;

    inch.style.width = "1in";
    inch.style.height = "1in";
    inch.style.position = "fixed";
    inch.style.left = "-100%";

    document.body.appendChild(inch);
    dpi = inch.offsetWidth;
    document.body.removeChild(inch);

    return dpi;
};

/**
 * @param {ol.MapEvent} mapEvent
 * @static
 */
ol.control.MapScale.render = function(mapEvent) {
    var frameState = mapEvent.frameState;

    if (frameState == null) {
        this.viewState_ = null;
    } else {
        this.viewState_ = frameState.viewState;
    }

    this.updateElement_();
};

/**
 * @protected
 */
ol.control.MapScale.prototype.handleUnitsChanged_ = function() {
    this.updateElement_();
};

/**
 * @param {ol.Map} map
 */
ol.control.MapScale.prototype.setMap = function(map) {
    this.scaleLine_.setMap(map);
    ol.control.Control.prototype.setMap.call(this, map);
};

/**
 * @protected
 */
ol.control.MapScale.prototype.updateElement_ = function() {
    var viewState = this.viewState_,
        center, resolution, projection,
        pointResolution, scale;

    if (viewState) {
        center = viewState.center,
        resolution = viewState.resolution,
        projection = viewState.projection,
        pointResolution = projection.getMetersPerUnit() * projection.getPointResolution(resolution, center),
        scale = Math.round(pointResolution * ol.control.MapScale.DOTS_PER_INCH * ol.control.MapScale.INCHES_PER_METER);

        this.scaleValue_.innerHTML = "1 : " + scale;
    }
};