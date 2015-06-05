/*
 * Snippet source : https://gist.github.com/tbranyen/1142129
 */
//
// // All navigation that is relative should be passed through the navigate
// method, to be processed by the router. If the link has a `data-bypass`
// attribute, bypass the delegation completely.
var GDP = GDP || {};
GDP.pushStateRouter = function(root) {
$(document).on("click", "a[href]:not([data-bypass])", function(evt) {
  // Get the absolute anchor href.
  var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
  // Get the absolute root.
  var root = location.protocol + "//" + location.host + root;

  // Ensure the root is part of the anchor href, meaning it's relative.
  if (href.prop.slice(0, root.length) === root) {
    // Stop the default event to ensure the link will not cause a page
    // refresh.
    evt.preventDefault();

    // Note by using Backbone.history.navigate, router events will not be
    // triggered.  If this is a problem, change this to navigate on your
    // router.
    Backbone.history.navigate(href, true);
  }
});
};


