/* Custom-JS für jQM | by T. Meinike 11/21 … 10/23 */

/* Kein Flackereffekt beim Laden der Seiten */
$(document).on("mobileinit", function()
{
  $.mobile.defaultPageTransition = "none";
});

/* Verarbeitung der Stichwörter in <span data-keyword="...">...</span> */
var key_id_old, key_sect_1_old, key_sect_2_old, key_sect_3_old, key_sect_4_old, key_sect_5_old, key_sect_6_old;
$(document).ready(function()
{
  // $("#keywords a").click(function()
  $("a[href^='#'").click(function()
  {
    var key_href, key_id, kap_id, key_sect_0, page_id;

    key_href   = $(this).attr("href");
    key_id     = key_href.split("#")[1];
    kap_id     = document.querySelector("[data-keyword='" + key_id + "'], [data-anchor='" + key_id + "']").closest("article").id;
    key_sect_0 = document.querySelector("[data-keyword='" + key_id + "'], [data-anchor='" + key_id + "']").closest("[data-role='collapsible']");
    key_sect_1 = $(key_sect_0);
    key_sect_2 = $(key_sect_1).parents("[data-role='collapsible']");
    key_sect_3 = $(key_sect_2).parents("[data-role='collapsible']");
    key_sect_4 = $(key_sect_3).parents("[data-role='collapsible']");
    key_sect_5 = $(key_sect_4).parents("[data-role='collapsible']");
    key_sect_6 = $(key_sect_5).parents("[data-role='collapsible']");

    // Unterseite zuweisen
    page_id = "#" + kap_id;
    $(":mobile-pagecontainer").pagecontainer("change", page_id);

    // Collapsibles nach nötiger section-Tiefe ein-/ausklappen
    if(key_sect_1_old)key_sect_1_old.collapsible("collapse");
    if(key_sect_1)key_sect_1.collapsible("expand");
    key_sect_1_old = key_sect_1;

    if(key_sect_2_old)key_sect_2_old.collapsible("collapse");
    if(key_sect_2)key_sect_2.collapsible("expand");
    key_sect_2_old = key_sect_2;

    if(key_sect_3_old)key_sect_3_old.collapsible("collapse");
    if(key_sect_3)key_sect_3.collapsible("expand");
    key_sect_3_old = key_sect_3;

    if(key_sect_4_old)key_sect_4_old.collapsible("collapse");
    if(key_sect_4)key_sect_4.collapsible("expand");
    key_sect_4_old = key_sect_4;

    if(key_sect_5_old)key_sect_5_old.collapsible("collapse");
    if(key_sect_5)key_sect_5.collapsible("expand");
    key_sect_5_old = key_sect_5;

    if(key_sect_6_old)key_sect_6_old.collapsible("collapse");
    if(key_sect_6)key_sect_6.collapsible("expand");
    key_sect_6_old = key_sect_6;

    // Aktives Schlüsselwort markieren
    if(key_id)document.querySelector("[data-keyword='" + key_id + "']").className = "keyword";
    if(key_id_old)document.querySelector("[data-keyword='" + key_id_old + "']").className = "";
    key_id_old = key_id;

    return false;
  });
});