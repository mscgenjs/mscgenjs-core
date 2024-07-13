// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`astAttributes`] = ` * \\msc
 *   Alice [linecolor="#008800", textcolor="black", textbgcolor="#CCFFCC", arclinecolor="#008800", arctextcolor="#008800"],
 *   Bob [linecolor="#FF0000", textcolor="black", textbgcolor="#FFCCCC", arclinecolor="#FF0000", arctextcolor="#FF0000"],
 *   pocket [linecolor="#0000FF", textcolor="black", textbgcolor="#CCCCFF", arclinecolor="#0000FF", arctextcolor="#0000FF"];
 * 
 *   Alice => Bob [label="do something funny"];
 *   Bob => pocket [label="fetch (nose flute)", textcolor="yellow", textbgcolor="green", arcskip="0.5"];
 *   Bob >> Alice [label="PHEEE!", textcolor="green", textbgcolor="yellow", arcskip="0.3"];
 *   Alice => Alice [label="hihihi", linecolor="#654321"];
 * \\endmsc`;

exports[`astWithPreComment`] = ` * \\msc
 *   a,
 *   b;
 * 
 *   a -> b;
 * \\endmsc`;

exports[`astSimple`] = ` * \\msc
 *   a,
 *   "b space";
 * 
 *   a => "b space" [label="a simple script"];
 * \\endmsc`;

exports[`auto`] = ` * \\msc
 * \\endmsc`;

exports[`entityWithMscGenKeywordAsName`] = ` * \\msc
 *   "note";
 * 
 * \\endmsc`;

exports[`fixedwidth`] = ` * \\msc
 *   width=800;
 * 
 * \\endmsc`;

exports[`astWithAWatermark`] = ` * \\msc
 *   a;
 * 
 * \\endmsc`;

exports[`astOneAlt`] = ` * \\msc
 *   a,
 *   b,
 *   c;
 * 
 *   a => b;
 *   b -- c;
 *     b => c;
 *     c >> b;
 * #;
 * \\endmsc`;

exports[`astAltWithinLoop`] = ` * \\msc
 *   a,
 *   b,
 *   c;
 * 
 *   a => b;
 *   a -- c [label="label for loop"];
 *     b -- c [label="label for alt"];
 *       b -> c [label="-> within alt"];
 *       c >> b [label=">> within alt"];
   * #;
 *     b >> a [label=">> within loop"];
 * #;
 *   a =>> a [label="happy-the-peppy - outside"];
 *   ...;
 * \\endmsc`;

module.exports = exports;
