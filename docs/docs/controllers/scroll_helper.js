const pauseCapGuy = function(el) {
    el.css('animation-play-state', 'paused');
};
let scrollHelper;
let guyAnimationTimeout;
var scroll_opts = {
    ready: function(ctx) {
        scrollHelper = this;
        this.on('scroll:change', function(e, data) {
            // console.log(data);
            switch (data.event) {
                case 'hit-top':
                    // TODO: reached top of the page
                    break;
                case 'scroll':
                    // TODO: scrolling...
                    break;
                case 'hit-bottom':
                    // TODO: reached end of the page
                    break;
            }
        }).watch('.watch', function(el, data) {
            el = zuix.$(el);
            if (data.event === 'scroll' || data.event === 'off-scroll') {
                let dy = data.frame.dy;
                if (el.hasClass('sh--capguy')) {
                    // CapGuy walking animation
                    const position = el.position();
                    const availableWidth = ctx.view().clientWidth;
                    dy = (1 - dy);
                    if (dy <= 1.5) {
                        let offsetX = (availableWidth*2*(dy - 0.2));
                        let offsetY = zuix.field('landscape').position().rect.bottom-position.y+50;
                        offsetY -= el.get().clientHeight;
                        el.css('transform', 'translate(' + offsetX + 'px,' + offsetY + 'px)');
                        el.css('animation-play-state', 'initial');
                        if (guyAnimationTimeout != null) {
                            clearTimeout(guyAnimationTimeout);
                        }
                        guyAnimationTimeout = setTimeout(function(){
                            pauseCapGuy(el);
                        }, 200);
                    }
                    fadeInOut(el, data);
                } else if (el.hasClass('sh-parallax')) {
                    // Castle Hills parallax animation
                    if (dy < 0) return;
                    let translate = -(dy * parseFloat(el.attr('data-translate')) * document.documentElement.offsetHeight);
                    el.css('transform', 'translateY(' + translate + 'px)');
                    fadeInOut(el, data, 0, 0.15);
                } else if (el.hasClass('sh-title')) {
                    if (dy < 1.1 && dy > 0.5) {
                        const scale = dy / 0.5;
                        el.css('transform', 'scale('+scale+')');
                        fadeInOut(el, data, 0, 0.25);
                    }
                } else {
                    // Default "watchable" animation:
                    //     ---> Fade-In enter / Fade-Out exit
                    fadeInOut(el, data);
                }

            }
        });
        zuix.field('arrow-down').on('click', function() {
            const viewport = scrollHelper.viewport();
            scrollHelper.scrollTo(viewport.height, 2000);
        });
    }
};

function fadeInOut(el, data, startOffset, endOffset) {
    if (startOffset == null) {
        startOffset = 0.2;
    }
    if (endOffset == null) {
        endOffset = 0.2;
    }
    if (data.frame.dy < startOffset) {
        el.css('opacity', data.frame.dy / startOffset);
    } else if (data.frame.dx < startOffset) {
        el.css('opacity', data.frame.dx / startOffset);
    } else if (data.frame.dy > 1-endOffset) {
        el.css('opacity', (1 - data.frame.dy) / endOffset);
    } else if (data.frame.dx > 1-endOffset) {
        el.css('opacity', (1 - data.frame.dx) / endOffset);
    } else if (parseFloat(el.css('opacity')) !== 1) {
        el.css('opacity', 1);
    }
}