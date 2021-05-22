{
  function isReserved(word) {
    return /^(SELECT|FROM|AS|USING|WHERE|AND|OR|NOT|GROUP|BY|ORDER|LIMIT|OFFSET|FOR|TRUE|FALSE|NULL)$/i.test(word);
  }
}

query =
    _ SELECT _ fields:queryFieldList _ objects:fromClause _ anything? {
            return { fields: fields, objects: objects };
        }

queryFieldList =
    head:queryFieldListItem comma tail:queryFieldList {
            return head.concat(tail);
        }
    / queryFieldListItem

queryFieldListItem =
    query_fields+

query_fields =
    subQuery / queryField

queryField =
    fieldExpr __ alias:identifier {
            return {alias: alias};
        }
    / fieldExpr

fieldExpr =
    toLabelCall / func:functionCall / name:fieldReference { return {name: name} }

functionCall =
    countCall:countCall {
            return {count: countCall};
        }
    /
    func:(identifier leftParen fieldReference rightParen) {
            return {function: func.join("")}
        }

toLabelCall =
    TOLABEL leftParen name:fieldReference rightParen { return {name: name} }

countCall =
    count:(COUNT leftParen _ rightParen) {
            return count.join("");
        }

fieldReference =
    field:(identifier DOT fieldReference) {
            return field.join("");
        }
    / identifier

fromClause =
    head:FROM __ tail:objectItemList {
            return tail;
        }

objectItemList =
    head:objectItemListItem comma tail:objectItemList {
            return head.concat(tail);
        }
    / objectItemListItem

objectItemListItem =
    objectReference+

objectReference =
    objectName:fieldReference (as / __) objectAlias:identifier {
            return { objectName: objectName, objectAlias: objectAlias };
        }
    / objectName:fieldReference {
            return { objectName: objectName };
        }

as =
    _ AS _

whereClause =
    WHERE __ identifier __ "=" __ identifier

subQuery =
    leftParen
    SELECT
    _
    subQueryFieldList
    _
    subQuery:subFromClause
    _
    whereClause?
    rightParen
    { return {subQuery: subQuery} }

subQueryFieldList =
    subQueryFieldListItem comma subQueryFieldList / subQueryFieldListItem

subQueryFieldListItem =
    fieldExpr

subFromClause =
    head:FROM __ tail:subObjectReference {
            return tail;
        }

subObjectReference =
    objectName:fieldReference (as / __) objectAlias:identifier {
            return { objectName: objectName, objectAlias: objectAlias };
        }
    / objectName:fieldReference {
            return {objectName:objectName};
        }

__ "whitespaces" = [ \t\n\r]+

_ "spacer" = [ \t\n\r]*

comma = _ ',' _;

leftParen = _ paren:LPAREN _ { return paren; }
rightParen = _ paren:RPAREN { return paren; }
anything = .*;
identifier = id:([a-zA-Z][0-9a-zA-Z_]* { return text() }) & { return !isReserved(id) } { return id; }

COMMA  = ","
DOT    = "."
LPAREN = "("
RPAREN = ")"

//Keywords

SELECT   = "SELECT"i
FROM     = "FROM"i
AS       = "AS"i
USING    = "USING"i
SCOPE    = "SCOPE"i
WHERE    = "WHERE"i
OR       = "OR"i
AND      = "AND"i
NOT      = "NOT"i
GROUP    = "GROUP"i
BY       = "BY"i
ROLLUP   = "ROLLUP"i
CUBE     = "CUBE"i
ORDER    = "ORDER"i
ASC      = "ASC"i
DESC     = "DESC"i
NULLS    = "NULLS"i
FIRST    = "FIRST"i
LAST     = "LAST"i
LIMIT    = "LIMIT"i
OFFSET   = "OFFSET"i
FOR      = "FOR"i
VIEW     = "VIEW"i
REFERENCE = "REFERENCE"i
TRUE     = "TRUE"i
FALSE    = "FALSE"i
NULL     = "NULL"i
COUNT    = "COUNT"i
TOLABEL  = "TOLABEL"i