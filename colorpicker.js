
// This code is a modification of Farbtastic 2.0.0-alpha.1
// Farbtastic was originally written by and (c) Steven Wittens (http://acko.net/)
// It is licensed under the GPL, and available here: https://github.com/mattfarina/farbtastic
// Modifications were written by and (c) Nicholas Root (http://www.nicholasbroot.com)
// This version is also licensed under GPL (with attribution, free to reuse, modify, and distribute)
// It is released as part of the Qualtrics Colorpicker (TODO GITHUB)
// If you use this code in any academic work, cite the following manuscript:
// TODO CITE

(function($) {

    var __debug = false;
    var twist = Math.random();

    $.fn.farbtastic = function(options) {
        var instance = this.data('farbtastic');

        if (!instance) {
            instance = new $.farbtastic(this, options);
            this.data('farbtastic', instance);
        }

        return instance; // Ensure this returns the Farbtastic object
    };

    $.farbtastic = function(container, options) {
        var container = $(container).get(0); // Ensure we're working with a DOM element
        var farbInstance = container.farbtastic;

        if (!farbInstance) {
            // Create a new Farbtastic object if it does not exist
            farbInstance = new $._farbtastic(container, options);
            $(container).data('farbtastic', farbInstance); // Store the new instance using jQuery's data method
        }

        return farbInstance;
    };

    $._farbtastic = function(container, options) {
        var fb = this;

        /////////////////////////////////////////////////////

        fb.updateValue = function(event) {
            if (this.value && this.value != fb.color) {
                fb.setColor(this.value);
            }
        }

        /**
         * Change color with HTML syntax #123456
         */


        fb.setColor = function(color) {
            var unpackxx = fb.unpackxx(color);
            if (fb.color != color && unpackxx) {
                fb.color = color;
                fb.rgb = unpackxx;
                fb.hsl = fb.RGBToHSL(fb.rgb);
                fb.updateDisplay();
            }
            return this;
        }

        // Get a random color (equiprobable in RGB space)
        fb.getRandomColor = function() {
            var letters = '0123456789abcdef';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        /**
         * Change color with HSL triplet [0..1, 0..1, 0..1]
         */
        fb.setHSL = function(hsl) {
            fb.hsl = hsl;
            fb.rgb = fb.HSLToRGB(hsl);
            fb.color = fb.pack(fb.rgb);
            fb.updateDisplay();
            return this;
        }

        /////////////////////////////////////////////////////

        /**
         * Initialize the color picker widget.
         */
        fb.initWidget = function() {

            // Insert markup and size accordingly.
            var dim = {
                width: options.width,
                height: options.width
            };
            $(container)
                .html(
                    '<div class="farbtastic" style="position: relative">' +
                    '<canvas class="farbtastic-mask"></canvas>' +
                    '<canvas class="farbtastic-overlay"></canvas>' +
                    '</div>'
                )
                .find('*').attr(dim).css(dim).end()
                .find('div>*').css('position', 'absolute');


            // Determine layout
            fb.radius = (options.width - options.wheelWidth) / 2 - 1;
            fb.square = Math.floor((fb.radius - options.wheelWidth / 2) * 0.7) - 1;
            fb.mid = Math.floor(options.width / 2);
            fb.markerSize = options.wheelWidth * 0.3;


            // Set up drawing context.
            fb.cnvMask = $('.farbtastic-mask', container);
            fb.ctxMask = fb.cnvMask[0].getContext('2d');
            fb.cnvOverlay = $('.farbtastic-overlay', container);
            fb.ctxOverlay = fb.cnvOverlay[0].getContext('2d');
            fb.ctxMask.translate(fb.mid, fb.mid);
            fb.ctxOverlay.translate(fb.mid, fb.mid);

            // Draw widget base layers.
            fb.setColor(fb.getRandomColor());
            fb.drawCircle();
            fb.drawMask();
        }


        /**
         * Draw the color wheel.
         */
        fb.drawCircle = function() {
            var tm = +(new Date());
            // Draw a hue circle with a bunch of gradient-stroked beziers.
            // Have to use beziers, as gradient-stroked arcs don't work.
            var n = 24,
                r = fb.radius,
                w = options.wheelWidth,
                nudge = 8 / r / n * Math.PI, // Fudge factor for seams.
                m = fb.ctxMask,
                angle1 = 0,
                color1, d1;
            m.save();
            m.lineWidth = w / r;
            m.scale(r, r);
            // Each segment goes from angle1 to angle2.
            for (var i = 0; i <= n; ++i) {
                var d2 = i / n,
                    angle2 = d2 * Math.PI * 2,
                    // Endpoints
                    x1 = Math.sin(angle1),
                    y1 = -Math.cos(angle1);
                x2 = Math.sin(angle2), y2 = -Math.cos(angle2),
                    // Midpoint chosen so that the endpoints are tangent to the circle.
                    am = (angle1 + angle2) / 2,
                    tan = 1 / Math.cos((angle2 - angle1) / 2),
                    xm = Math.sin(am) * tan, ym = -Math.cos(am) * tan,
                    // New color
                    color2 = fb.pack(fb.HSLToRGB([(d2) % 1, 1, 0.5]));
                if (i > 0) {
                    // Create gradient fill between the endpoints.
                    var grad = m.createLinearGradient(x1, y1, x2, y2);
                    grad.addColorStop(0, color1);
                    grad.addColorStop(1, color2);
                    m.strokeStyle = grad;
                    // Draw quadratic curve segment.
                    m.beginPath();
                    m.moveTo(x1, y1);
                    m.quadraticCurveTo(xm, ym, x2, y2);
                    m.stroke();
                }
                // Prevent seams where curves join.
                angle1 = angle2 - nudge;
                color1 = color2;
                d1 = d2;
            }
            m.restore();
            __debug && $('body').append('<div>drawCircle ' + (+(new Date()) - tm) + 'ms');
        };

        /**
         * Draw the saturation/luminance mask.
         */
        fb.drawMask = function() {
            var tm = +(new Date());

            // Iterate over sat/lum space and calculate appropriate mask pixel values.
            var size = fb.square * 2,
                sq = fb.square;

            function calculateMask(sizex, sizey, outputPixel) {
                var isx = 1 / sizex,
                    isy = 1 / sizey;
                for (var y = 0; y <= sizey; ++y) {
                    var l = 1 - y * isy;
                    for (var x = 0; x <= sizex; ++x) {
                        var s = 1 - x * isx;
                        // From sat/lum to alpha and color (grayscale)
                        var a = 1 - 2 * Math.min(l * s, (1 - l) * s);
                        var c = (a > 0) ? ((2 * l - 1 + a) * .5 / a) : 0;
                        outputPixel(x, y, c, a);
                    }
                }
            }

            // Method #1: direct pixel access (new Canvas).
            if (fb.ctxMask.getImageData) {
                // Create half-resolution buffer.
                var sz = Math.floor(size / 2);
                var buffer = document.createElement('canvas');
                buffer.width = buffer.height = sz + 1;
                var ctx = buffer.getContext('2d');
                var frame = ctx.getImageData(0, 0, sz + 1, sz + 1);

                var i = 0;
                calculateMask(sz, sz, function(x, y, c, a) {
                    frame.data[i++] = frame.data[i++] = frame.data[i++] = c * 255;
                    frame.data[i++] = a * 255;
                });

                ctx.putImageData(frame, 0, 0);
                fb.ctxMask.fillStyle = fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5]));
                fb.ctxMask.fillRect(-sq, -sq, sq * 2, sq * 2);
                fb.ctxMask.drawImage(buffer, 0, 0, sz + 1, sz + 1, -sq, -sq, sq * 2, sq * 2);
            }
            // Method #3: vertical DXImageTransform gradient strips (IE).
            else {
                var cache_last, cache, w = 6; // Each strip is 6 pixels wide.
                var sizex = Math.floor(size / w);
                // 6 vertical pieces of gradient per strip.
                calculateMask(sizex, 6, function(x, y, c, a) {
                    if (x == 0) {
                        cache_last = cache;
                        cache = [];
                    }
                    c = Math.round(c * 255);
                    a = Math.round(a * 255);
                    // We can only start outputting gradients once we have two rows of pixels.
                    if (y > 0) {
                        var c_last = cache_last[x][0],
                            a_last = cache_last[x][1],
                            color1 = fb.packDX(c_last, a_last),
                            color2 = fb.packDX(c, a),
                            y1 = Math.round(fb.mid + ((y - 1) * .333 - 1) * sq),
                            y2 = Math.round(fb.mid + (y * .333 - 1) * sq);
                        $('<div>').css({
                            position: 'absolute',
                            filter: "progid:DXImageTransform.Microsoft.Gradient(StartColorStr=" + color1 + ", EndColorStr=" + color2 + ", GradientType=0)",
                            top: y1,
                            height: y2 - y1,
                            // Avoid right-edge sticking out.
                            left: fb.mid + (x * w - sq - 1),
                            width: w - (x == sizex ? Math.round(w / 2) : 0)
                        }).appendTo(fb.cnvMask);
                    }
                    cache.push([c, a]);
                });
            }
            __debug && $('body').append('<div>drawMask ' + (+(new Date()) - tm) + 'ms');
        }

        /**
         * Draw the selection markers.
         */
        fb.drawMarkers = function() {
            // Determine marker dimensions
            var sz = options.width,
                lw = Math.ceil(fb.markerSize / 4),
                r = fb.markerSize - lw + 1;
            var angle = ((fb.hsl[0]) % 1) * 6.28,
                x1 = Math.sin(angle) * fb.radius,
                y1 = -Math.cos(angle) * fb.radius,
                x2 = 2 * fb.square * (.5 - fb.hsl[1]),
                y2 = 2 * fb.square * (.5 - fb.hsl[2]),
                c1 = fb.invert ? '#fff' : '#000',
                c2 = fb.invert ? '#000' : '#fff';
            var circles = [{
                    x: x1,
                    y: y1,
                    r: r,
                    c: '#000',
                    lw: lw + 1
                },
                {
                    x: x1,
                    y: y1,
                    r: fb.markerSize,
                    c: '#fff',
                    lw: lw
                },
                {
                    x: x2,
                    y: y2,
                    r: r,
                    c: c2,
                    lw: lw + 1
                },
                {
                    x: x2,
                    y: y2,
                    r: fb.markerSize,
                    c: c1,
                    lw: lw
                },
            ];

            // Update the overlay canvas.
            fb.ctxOverlay.clearRect(-fb.mid, -fb.mid, sz, sz);
            for (var i = 0; i < circles.length; i++) {
                var c = circles[i];
                fb.ctxOverlay.lineWidth = c.lw;
                fb.ctxOverlay.strokeStyle = c.c;
                fb.ctxOverlay.beginPath();
                fb.ctxOverlay.arc(c.x, c.y, c.r, 0, Math.PI * 2, true);
                fb.ctxOverlay.stroke();
            }
        }

        /**
         * Update the markers and styles
         */
        fb.updateDisplay = function() {
            // Determine whether labels/markers should invert.
            fb.invert = (fb.rgb[0] * 0.3 + fb.rgb[1] * .59 + fb.rgb[2] * .11) <= 0.6;

            // Update the solid background fill.
            fb.drawMask();

            // Draw markers
            fb.drawMarkers();

            // Callback
            if (typeof fb.callback == 'function') {
                fb.callback.call(fb, fb.color);
            }
        }

        /**
         * Helper for returning coordinates relative to the center.
         */
        fb.widgetCoords = function(event) {
            return {
                x: event.pageX - fb.offset.left - fb.mid,
                y: event.pageY - fb.offset.top - fb.mid
            };
        }

        /**
         * Mousedown handler
         */
        fb.mousedown = function(event) {
            // Capture mouse
            if (!$._farbtastic.dragging) {
                $(document).on('pointermove', fb.mousemove).on('pointerup', fb.mouseup);
                $._farbtastic.dragging = true;
            }

            // Update the stored offset for the widget.
            fb.offset = $(container).offset();

            // Check which area is being dragged
            var pos = fb.widgetCoords(event);
            fb.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) > (fb.square + 2);

            // Process
            fb.mousemove(event);
            return false;
        }

        /**
         * Mousemove handler
         */
        fb.mousemove = function(event) {
            // Get coordinates relative to color picker center
            var pos = fb.widgetCoords(event);

            // Set new HSL parameters
            if (fb.circleDrag) {
                var hue = Math.atan2(pos.x, -pos.y) / 6.28;
                fb.setHSL([(hue + 1) % 1, fb.hsl[1], fb.hsl[2]]);
            } else {
                var sat = Math.max(0, Math.min(1, -(pos.x / fb.square / 2) + .5));
                var lum = Math.max(0, Math.min(1, -(pos.y / fb.square / 2) + .5));
                fb.setHSL([fb.hsl[0], sat, lum]);
            }
            return false;
        }

        /**
         * Mouseup handler
         */
        fb.mouseup = function() {
            // Uncapture mouse
            $(document).off('pointermove', fb.mousemove);
            $(document).off('pointerup', fb.mouseup);
            $._farbtastic.dragging = false;
        }

        /* Various color utility functions */
        fb.dec2hex = function(x) {
            return (x < 16 ? '0' : '') + x.toString(16);
        }

        fb.packDX = function(c, a) {
            return '#' + fb.dec2hex(a) + fb.dec2hex(c) + fb.dec2hex(c) + fb.dec2hex(c);
        };

        fb.pack = function(rgb) {
            var r = Math.round(rgb[0] * 255);
            var g = Math.round(rgb[1] * 255);
            var b = Math.round(rgb[2] * 255);
            return '#' + fb.dec2hex(r) + fb.dec2hex(g) + fb.dec2hex(b);
        };

        fb.unpackxx = function(color) {
            if (color.length == 7) {
                function x(i) {
                    return parseInt(color.substring(i, i + 2), 16) / 255;
                }
                return [x(1), x(3), x(5)];
            } else if (color.length == 4) {
                function x(i) {
                    return parseInt(color.substring(i, i + 1), 16) / 15;
                }
                return [x(1), x(2), x(3)];
            }
        };

        fb.HSLToRGB = function(hsl) {
            var m1, m2, r, g, b;
            var h = (hsl[0] + twist) % 1,
                s = hsl[1],
                l = hsl[2];
            m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
            m1 = l * 2 - m2;
            return [
                this.hueToRGB(m1, m2, h + 0.33333),
                this.hueToRGB(m1, m2, h),
                this.hueToRGB(m1, m2, h - 0.33333)
            ];
        };

        fb.hueToRGB = function(m1, m2, h) {
            h = (h + 1) % 1;
            if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
            if (h * 2 < 1) return m2;
            if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
            return m1;
        };

        fb.RGBToHSL = function(rgb) {
            var r = rgb[0],
                g = rgb[1],
                b = rgb[2],
                min = Math.min(r, g, b),
                max = Math.max(r, g, b),
                delta = max - min,
                h = 0,
                s = 0,
                l = (min + max) / 2;
            if (l > 0 && l < 1) {
                s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
            }
            if (delta > 0) {
                if (max == r && max != g) h += (g - b) / delta;
                if (max == g && max != b) h += (2 + (b - r) / delta);
                if (max == b && max != r) h += (4 + (r - g) / delta);
                h /= 6;
            }
            h = (h - twist) % 1
            return [h, s, l];
        };

        // Parse options
        options = $.extend({
            width: 250,
            wheelWidth: (options.width || 250) / 10,
            callback: null
        }, options);
        
        // Set callback
        fb.callback = options.callback;

        // Initialize.
        fb.initWidget();

        // Install mousedown handler (the others are set on the document on-demand)
        $('canvas.farbtastic-overlay', container).on('pointerdown', fb.mousedown);

        
    }

})(jQuery);