/*
--------------------------------------------------------------------------
(c) 2007 Lawrence Akka
 - jquery version of the spamspan code (c) 2006 SpamSpan (www.spamspan.com)

This program is distributed under the terms of the GNU General Public
Licence version 2, available at http://www.gnu.org/licenses/gpl.txt
--------------------------------------------------------------------------
*/

(function ($) { //Standard drupal jQuery wrapper.  See http://drupal.org/update/modules/6/7#javascript_compatibility
// load SpamSpan
Drupal.behaviors.spamspan = {
  attach: function(context, settings) {
    // get each span with class spamspan
    $("span.spamspan", context).each(function (index) {
      // Replace each <spam class="t"></spam> with .
      if ($('span.t', this).length) {
        $('span.t', this).replaceWith('.');
      }
      
      // For each selected span, set mail to the relevant value, removing spaces
      var _mail = ($("span.u", this).text() +
        "@" +
        $("span.d", this).text())
        .replace(/\s+/g, '');

      // Build the mailto URI
      var _mailto = "mailto:" + _mail;
      if ($('span.h', this).length) {
        // Find the header text, and remove the round brackets from the start and end
        var _headerText = $("span.h", this).text().replace(/^ ?\((.*)\) ?$/, "$1");
        // split into individual headers, and return as an array of header=value pairs
        var _headers = $.map(_headerText.split(/, /), function (n, i) {
          return (n.replace(/: /, "="));
        });

        var _headerstring = _headers.join('&');
        _mailto += _headerstring ? ("?" + _headerstring) : '';
      }

      // Find the anchor content, and remove the round brackets from the start and end
      var _anchorContent = $("span.a", this).html();
      if (_anchorContent) {
        _anchorContent = _anchorContent.replace(/^ ?\((.*)\) ?$/, "$1");
      }

      // create the <a> element, and replace the original span contents

      //check for extra <a> attributes
      var _attributes = $("span.e", this).html();
      var _tag = "<a></a>";
      if (_attributes) {
        _tag = "<a " + _attributes.replace("<!--", "").replace("-->", "") + "></a>";
      }

      $(this).after(
        $(_tag)
          .attr("href", _mailto)
          .html(_anchorContent ? _anchorContent : _mail)
          .addClass("spamspan")
      ).remove();
    });
  }
};
}) (jQuery);;

(function($) {
  Drupal.behaviors.CToolsJumpMenu = {
    attach: function(context) {
      $('.ctools-jump-menu-hide')
        .once('ctools-jump-menu')
        .hide();

      $('.ctools-jump-menu-change')
        .once('ctools-jump-menu')
        .change(function() {
          var loc = $(this).val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });

      $('.ctools-jump-menu-button')
        .once('ctools-jump-menu')
        .click(function() {
          // Instead of submitting the form, just perform the redirect.

          // Find our sibling value.
          var $select = $(this).parents('form').find('.ctools-jump-menu-select');
          var loc = $select.val();
          var urlArray = loc.split('::');
          if (urlArray[1]) {
            location.href = urlArray[1];
          }
          else {
            location.href = loc;
          }
          return false;
        });
    }
  };
})(jQuery);
;
/**
 * @file
 * Adds smooth scrolling to TOC anchor links.
 *
 * From: Scroll window smoothly in jQuery - Animated scroll
 *       http://blog.freelancer-id.com/2009/03/26/scroll-window-smoothly-in-jquery/
 */

(function ($) {

Drupal.tocFilterScrollToOnClick = function() {
  // Make sure links still has hash.
  if (!this.hash || this.hash == '#') {
    return true;
  }

  // Make sure the href is pointing to an anchor link on this page.
  var href = this.href.replace(/#[^#]*$/, '');
  var url = window.location.toString();
  if (href && url.indexOf(href) === -1) {
    return true;
  }

  // Scroll to the anchor
  return Drupal.tocFilterScrollTo(this.hash);
}

Drupal.tocFilterScrollTo = function(hash) {
  // Find hash target.
  var $a = $('a[name=' + hash.substring(1) + ']');

  // Make hash target is on the current page.
  if (!$a.length) {
    return true;
  }

  // Scroll to hash target
  var duration = Drupal.settings.toc_filter_smooth_scroll_duration || 'medium';
  $('html, body').animate({scrollTop: $a.offset().top}, duration);

  // Move focus to targets back to top link.
  // Target anchor not focused; breaks keyboard navigation https://drupal.org/node/2058875
  $a.parent().prev('.toc-filter-back-to-top').find('a').focus();

  return false;
}

Drupal.behaviors.tocFilterSmoothScroll = {
  attach: function (context) {
    // Only map <a href="#..."> links
    $('a[href*="#"]', context).once('toc-filter').click(Drupal.tocFilterScrollToOnClick);
  }
};

// Override CToolsJumpMenu behavior for TOC filter jumpmenus.
Drupal.behaviors.tocFilterCToolsJumpMenu = {
  attach: function(context) {
    $('.toc-filter-jump-menu .ctools-jump-menu-change:not(.toc-filter-jump-menu-processed)')
      .addClass('toc-filter-jump-menu-processed')
      .unbind('change')
      .change(function() {
        // Find our sibling value.
        var $select = $(this).parents('form').find('.ctools-jump-menu-select');
        var hash = $select.val();
        if (hash) {
          Drupal.tocFilterScrollTo(hash);
        }
        $select.find('option:first').attr('selected', true);
        return false;
      });
  }
};

})(jQuery)
;
