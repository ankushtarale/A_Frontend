/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/host/src/reflection", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An enumeration of possible kinds of class members.
     */
    var ClassMemberKind;
    (function (ClassMemberKind) {
        ClassMemberKind[ClassMemberKind["Constructor"] = 0] = "Constructor";
        ClassMemberKind[ClassMemberKind["Getter"] = 1] = "Getter";
        ClassMemberKind[ClassMemberKind["Setter"] = 2] = "Setter";
        ClassMemberKind[ClassMemberKind["Property"] = 3] = "Property";
        ClassMemberKind[ClassMemberKind["Method"] = 4] = "Method";
    })(ClassMemberKind = exports.ClassMemberKind || (exports.ClassMemberKind = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvaG9zdC9zcmMvcmVmbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQXNDSDs7T0FFRztJQUNILElBQVksZUFNWDtJQU5ELFdBQVksZUFBZTtRQUN6QixtRUFBVyxDQUFBO1FBQ1gseURBQU0sQ0FBQTtRQUNOLHlEQUFNLENBQUE7UUFDTiw2REFBUSxDQUFBO1FBQ1IseURBQU0sQ0FBQTtJQUNSLENBQUMsRUFOVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQU0xQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogTWV0YWRhdGEgZXh0cmFjdGVkIGZyb20gYW4gaW5zdGFuY2Ugb2YgYSBkZWNvcmF0b3Igb24gYW5vdGhlciBkZWNsYXJhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZWNvcmF0b3Ige1xuICAvKipcbiAgICogTmFtZSBieSB3aGljaCB0aGUgZGVjb3JhdG9yIHdhcyBpbnZva2VkIGluIHRoZSB1c2VyJ3MgY29kZS5cbiAgICpcbiAgICogVGhpcyBpcyBkaXN0aW5jdCBmcm9tIHRoZSBuYW1lIGJ5IHdoaWNoIHRoZSBkZWNvcmF0b3Igd2FzIGltcG9ydGVkICh0aG91Z2ggaW4gcHJhY3RpY2UgdGhleVxuICAgKiB3aWxsIHVzdWFsbHkgYmUgdGhlIHNhbWUpLlxuICAgKi9cbiAgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVyIHdoaWNoIHJlZmVycyB0byB0aGUgZGVjb3JhdG9yIGluIHNvdXJjZS5cbiAgICovXG4gIGlkZW50aWZpZXI6IHRzLklkZW50aWZpZXI7XG5cbiAgLyoqXG4gICAqIGBJbXBvcnRgIGJ5IHdoaWNoIHRoZSBkZWNvcmF0b3Igd2FzIGJyb3VnaHQgaW50byB0aGUgbW9kdWxlIGluIHdoaWNoIGl0IHdhcyBpbnZva2VkLCBvciBgbnVsbGBcbiAgICogaWYgdGhlIGRlY29yYXRvciB3YXMgZGVjbGFyZWQgaW4gdGhlIHNhbWUgbW9kdWxlIGFuZCBub3QgaW1wb3J0ZWQuXG4gICAqL1xuICBpbXBvcnQgOiBJbXBvcnQgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlU2NyaXB0IHJlZmVyZW5jZSB0byB0aGUgZGVjb3JhdG9yIGl0c2VsZi5cbiAgICovXG4gIG5vZGU6IHRzLk5vZGU7XG5cbiAgLyoqXG4gICAqIEFyZ3VtZW50cyBvZiB0aGUgaW52b2NhdGlvbiBvZiB0aGUgZGVjb3JhdG9yLCBpZiB0aGUgZGVjb3JhdG9yIGlzIGludm9rZWQsIG9yIGBudWxsYCBvdGhlcndpc2UuXG4gICAqL1xuICBhcmdzOiB0cy5FeHByZXNzaW9uW118bnVsbDtcbn1cblxuLyoqXG4gKiBBbiBlbnVtZXJhdGlvbiBvZiBwb3NzaWJsZSBraW5kcyBvZiBjbGFzcyBtZW1iZXJzLlxuICovXG5leHBvcnQgZW51bSBDbGFzc01lbWJlcktpbmQge1xuICBDb25zdHJ1Y3RvcixcbiAgR2V0dGVyLFxuICBTZXR0ZXIsXG4gIFByb3BlcnR5LFxuICBNZXRob2QsXG59XG5cbi8qKlxuICogQSBtZW1iZXIgb2YgYSBjbGFzcywgc3VjaCBhcyBhIHByb3BlcnR5LCBtZXRob2QsIG9yIGNvbnN0cnVjdG9yLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsYXNzTWVtYmVyIHtcbiAgLyoqXG4gICAqIFR5cGVTY3JpcHQgcmVmZXJlbmNlIHRvIHRoZSBjbGFzcyBtZW1iZXIgaXRzZWxmLCBvciBudWxsIGlmIGl0IGlzIG5vdCBhcHBsaWNhYmxlLlxuICAgKi9cbiAgbm9kZTogdHMuTm9kZXxudWxsO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0aW9uIG9mIHdoaWNoIHR5cGUgb2YgbWVtYmVyIHRoaXMgaXMgKHByb3BlcnR5LCBtZXRob2QsIGV0YykuXG4gICAqL1xuICBraW5kOiBDbGFzc01lbWJlcktpbmQ7XG5cbiAgLyoqXG4gICAqIFR5cGVTY3JpcHQgYHRzLlR5cGVOb2RlYCByZXByZXNlbnRpbmcgdGhlIHR5cGUgb2YgdGhlIG1lbWJlciwgb3IgYG51bGxgIGlmIG5vdCBwcmVzZW50IG9yXG4gICAqIGFwcGxpY2FibGUuXG4gICAqL1xuICB0eXBlOiB0cy5UeXBlTm9kZXxudWxsO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBjbGFzcyBtZW1iZXIuXG4gICAqL1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFR5cGVTY3JpcHQgYHRzLklkZW50aWZpZXJgIHJlcHJlc2VudGluZyB0aGUgbmFtZSBvZiB0aGUgbWVtYmVyLCBvciBgbnVsbGAgaWYgbm8gc3VjaCBub2RlXG4gICAqIGlzIHByZXNlbnQuXG4gICAqXG4gICAqIFRoZSBgbmFtZU5vZGVgIGlzIHVzZWZ1bCBpbiB3cml0aW5nIHJlZmVyZW5jZXMgdG8gdGhpcyBtZW1iZXIgdGhhdCB3aWxsIGJlIGNvcnJlY3RseSBzb3VyY2UtXG4gICAqIG1hcHBlZCBiYWNrIHRvIHRoZSBvcmlnaW5hbCBmaWxlLlxuICAgKi9cbiAgbmFtZU5vZGU6IHRzLklkZW50aWZpZXJ8bnVsbDtcblxuICAvKipcbiAgICogVHlwZVNjcmlwdCBgdHMuRXhwcmVzc2lvbmAgd2hpY2ggcmVwcmVzZW50cyB0aGUgdmFsdWUgb2YgdGhlIG1lbWJlci5cbiAgICpcbiAgICogSWYgdGhlIG1lbWJlciBpcyBhIHByb3BlcnR5LCB0aGlzIHdpbGwgYmUgdGhlIHByb3BlcnR5IGluaXRpYWxpemVyIGlmIHRoZXJlIGlzIG9uZSwgb3IgbnVsbFxuICAgKiBvdGhlcndpc2UuXG4gICAqL1xuICB2YWx1ZTogdHMuRXhwcmVzc2lvbnxudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlU2NyaXB0IGB0cy5EZWNsYXJhdGlvbmAgd2hpY2ggcmVwcmVzZW50cyB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhlIG1lbWJlci5cbiAgICpcbiAgICogSW4gVHlwZVNjcmlwdCBjb2RlIHRoaXMgaXMgaWRlbnRpY2FsIHRvIHRoZSBub2RlLCBidXQgaW4gZG93bmxldmVsZWQgY29kZSB0aGlzIHNob3VsZCBhbHdheXMgYmVcbiAgICogdGhlIERlY2xhcmF0aW9uIHdoaWNoIGFjdHVhbGx5IHJlcHJlc2VudHMgdGhlIG1lbWJlcidzIHJ1bnRpbWUgdmFsdWUuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCB0aGUgVFMgY29kZTpcbiAgICpcbiAgICogYGBgXG4gICAqIGNsYXNzIENsYXp6IHtcbiAgICogICBzdGF0aWMgZ2V0IHByb3BlcnR5KCk6IHN0cmluZyB7XG4gICAqICAgICByZXR1cm4gJ3ZhbHVlJztcbiAgICogICB9XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIERvd25sZXZlbHMgdG86XG4gICAqXG4gICAqIGBgYFxuICAgKiB2YXIgQ2xhenogPSAoZnVuY3Rpb24gKCkge1xuICAgKiAgIGZ1bmN0aW9uIENsYXp6KCkge1xuICAgKiAgIH1cbiAgICogICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2xhenosIFwicHJvcGVydHlcIiwge1xuICAgKiAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICogICAgICAgICAgIHJldHVybiAndmFsdWUnO1xuICAgKiAgICAgICB9LFxuICAgKiAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgKiAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICogICB9KTtcbiAgICogICByZXR1cm4gQ2xheno7XG4gICAqIH0oKSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBJbiB0aGlzIGV4YW1wbGUsIGZvciB0aGUgcHJvcGVydHkgXCJwcm9wZXJ0eVwiLCB0aGUgbm9kZSB3b3VsZCBiZSB0aGUgZW50aXJlXG4gICAqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBFeHByZXNzaW9uU3RhdGVtZW50LCBidXQgdGhlIGltcGxlbWVudGF0aW9uIHdvdWxkIGJlIHRoaXNcbiAgICogRnVuY3Rpb25EZWNsYXJhdGlvbjpcbiAgICpcbiAgICogYGBgXG4gICAqIGZ1bmN0aW9uICgpIHtcbiAgICogICByZXR1cm4gJ3ZhbHVlJztcbiAgICogfSxcbiAgICogYGBgXG4gICAqL1xuICBpbXBsZW1lbnRhdGlvbjogdHMuRGVjbGFyYXRpb258bnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgbWVtYmVyIGlzIHN0YXRpYyBvciBub3QuXG4gICAqL1xuICBpc1N0YXRpYzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW55IGBEZWNvcmF0b3JgcyB3aGljaCBhcmUgcHJlc2VudCBvbiB0aGUgbWVtYmVyLCBvciBgbnVsbGAgaWYgbm9uZSBhcmUgcHJlc2VudC5cbiAgICovXG4gIGRlY29yYXRvcnM6IERlY29yYXRvcltdfG51bGw7XG59XG5cbi8qKlxuICogQSBwYXJhbWV0ZXIgdG8gYSBjb25zdHJ1Y3Rvci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdG9yUGFyYW1ldGVyIHtcbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIHBhcmFtZXRlciwgaWYgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBTb21lIHBhcmFtZXRlcnMgZG9uJ3QgaGF2ZSBhIHNpbXBsZSBzdHJpbmcgbmFtZSAoZm9yIGV4YW1wbGUsIHBhcmFtZXRlcnMgd2hpY2ggYXJlIGRlc3RydWN0dXJlZFxuICAgKiBpbnRvIG11bHRpcGxlIHZhcmlhYmxlcykuIEluIHRoZXNlIGNhc2VzLCBgbmFtZWAgY2FuIGJlIGBudWxsYC5cbiAgICovXG4gIG5hbWU6IHN0cmluZ3xudWxsO1xuXG4gIC8qKlxuICAgKiBUeXBlU2NyaXB0IGB0cy5CaW5kaW5nTmFtZWAgcmVwcmVzZW50aW5nIHRoZSBuYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIFRoZSBgbmFtZU5vZGVgIGlzIHVzZWZ1bCBpbiB3cml0aW5nIHJlZmVyZW5jZXMgdG8gdGhpcyBtZW1iZXIgdGhhdCB3aWxsIGJlIGNvcnJlY3RseSBzb3VyY2UtXG4gICAqIG1hcHBlZCBiYWNrIHRvIHRoZSBvcmlnaW5hbCBmaWxlLlxuICAgKi9cbiAgbmFtZU5vZGU6IHRzLkJpbmRpbmdOYW1lO1xuXG4gIC8qKlxuICAgKiBUeXBlU2NyaXB0IGB0cy5FeHByZXNzaW9uYCByZXByZXNlbnRpbmcgdGhlIHR5cGUgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciwgaWYgdGhlIHR5cGUgaXMgYVxuICAgKiBzaW1wbGVcbiAgICogZXhwcmVzc2lvbiB0eXBlIHRoYXQgY2FuIGJlIGNvbnZlcnRlZCB0byBhIHZhbHVlLlxuICAgKlxuICAgKiBJZiB0aGUgdHlwZSBpcyBub3QgcHJlc2VudCBvciBjYW5ub3QgYmUgcmVwcmVzZW50ZWQgYXMgYW4gZXhwcmVzc2lvbiwgYHR5cGVgIGlzIGBudWxsYC5cbiAgICovXG4gIHR5cGVFeHByZXNzaW9uOiB0cy5FeHByZXNzaW9ufG51bGw7XG5cbiAgLyoqXG4gICAqIFR5cGVTY3JpcHQgYHRzLlR5cGVOb2RlYCByZXByZXNlbnRpbmcgdGhlIHR5cGUgbm9kZSBmb3VuZCBpbiB0aGUgdHlwZSBwb3NpdGlvbi5cbiAgICpcbiAgICogVGhpcyBmaWVsZCBjYW4gYmUgdXNlZCBmb3IgZGlhZ25vc3RpY3MgcmVwb3J0aW5nIGlmIGB0eXBlRXhwcmVzc2lvbmAgaXMgYG51bGxgLlxuICAgKlxuICAgKiBDYW4gYmUgbnVsbCwgaWYgdGhlIHBhcmFtIGhhcyBubyB0eXBlIGRlY2xhcmVkLlxuICAgKi9cbiAgdHlwZU5vZGU6IHRzLlR5cGVOb2RlfG51bGw7XG5cbiAgLyoqXG4gICAqIEFueSBgRGVjb3JhdG9yYHMgd2hpY2ggYXJlIHByZXNlbnQgb24gdGhlIHBhcmFtZXRlciwgb3IgYG51bGxgIGlmIG5vbmUgYXJlIHByZXNlbnQuXG4gICAqL1xuICBkZWNvcmF0b3JzOiBEZWNvcmF0b3JbXXxudWxsO1xufVxuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBmdW5jdGlvbiBvciBtZXRob2QsIGluY2x1ZGluZyBpdHMgYm9keSBpZiBwcmVzZW50IGFuZCBhbnkgcGFyYW1ldGVycy5cbiAqXG4gKiBJbiBUeXBlU2NyaXB0IGNvZGUgdGhpcyBtZXRhZGF0YSB3aWxsIGJlIGEgc2ltcGxlIHJlZmxlY3Rpb24gb2YgdGhlIGRlY2xhcmF0aW9ucyBpbiB0aGUgbm9kZVxuICogaXRzZWxmLiBJbiBFUzUgY29kZSB0aGlzIGNhbiBiZSBtb3JlIGNvbXBsaWNhdGVkLCBhcyB0aGUgZGVmYXVsdCB2YWx1ZXMgZm9yIHBhcmFtZXRlcnMgbWF5XG4gKiBiZSBleHRyYWN0ZWQgZnJvbSBjZXJ0YWluIGJvZHkgc3RhdGVtZW50cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGdW5jdGlvbkRlZmluaXRpb248VCBleHRlbmRzIHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRGVjbGFyYXRpb258XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cy5GdW5jdGlvbkV4cHJlc3Npb24+IHtcbiAgLyoqXG4gICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBub2RlIHdoaWNoIGRlY2xhcmVzIHRoZSBmdW5jdGlvbi5cbiAgICovXG4gIG5vZGU6IFQ7XG5cbiAgLyoqXG4gICAqIFN0YXRlbWVudHMgb2YgdGhlIGZ1bmN0aW9uIGJvZHksIGlmIGEgYm9keSBpcyBwcmVzZW50LCBvciBudWxsIGlmIG5vIGJvZHkgaXMgcHJlc2VudC5cbiAgICpcbiAgICogVGhpcyBsaXN0IG1heSBoYXZlIGJlZW4gZmlsdGVyZWQgdG8gZXhjbHVkZSBzdGF0ZW1lbnRzIHdoaWNoIHBlcmZvcm0gcGFyYW1ldGVyIGRlZmF1bHQgdmFsdWVcbiAgICogaW5pdGlhbGl6YXRpb24uXG4gICAqL1xuICBib2R5OiB0cy5TdGF0ZW1lbnRbXXxudWxsO1xuXG4gIC8qKlxuICAgKiBNZXRhZGF0YSByZWdhcmRpbmcgdGhlIGZ1bmN0aW9uJ3MgcGFyYW1ldGVycywgaW5jbHVkaW5nIHBvc3NpYmxlIGRlZmF1bHQgdmFsdWUgZXhwcmVzc2lvbnMuXG4gICAqL1xuICBwYXJhbWV0ZXJzOiBQYXJhbWV0ZXJbXTtcbn1cblxuLyoqXG4gKiBBIHBhcmFtZXRlciB0byBhIGZ1bmN0aW9uIG9yIG1ldGhvZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJhbWV0ZXIge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgcGFyYW1ldGVyLCBpZiBhdmFpbGFibGUuXG4gICAqL1xuICBuYW1lOiBzdHJpbmd8bnVsbDtcblxuICAvKipcbiAgICogRGVjbGFyYXRpb24gd2hpY2ggY3JlYXRlZCB0aGlzIHBhcmFtZXRlci5cbiAgICovXG4gIG5vZGU6IHRzLlBhcmFtZXRlckRlY2xhcmF0aW9uO1xuXG4gIC8qKlxuICAgKiBFeHByZXNzaW9uIHdoaWNoIHJlcHJlc2VudHMgdGhlIGRlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciwgaWYgYW55LlxuICAgKi9cbiAgaW5pdGlhbGl6ZXI6IHRzLkV4cHJlc3Npb258bnVsbDtcbn1cblxuLyoqXG4gKiBUaGUgc291cmNlIG9mIGFuIGltcG9ydGVkIHN5bWJvbCwgaW5jbHVkaW5nIHRoZSBvcmlnaW5hbCBzeW1ib2wgbmFtZSBhbmQgdGhlIG1vZHVsZSBmcm9tIHdoaWNoIGl0XG4gKiB3YXMgaW1wb3J0ZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW1wb3J0IHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBpbXBvcnRlZCBzeW1ib2wgdW5kZXIgd2hpY2ggaXQgd2FzIGV4cG9ydGVkIChub3QgaW1wb3J0ZWQpLlxuICAgKi9cbiAgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbW9kdWxlIGZyb20gd2hpY2ggdGhlIHN5bWJvbCB3YXMgaW1wb3J0ZWQuXG4gICAqXG4gICAqIFRoaXMgY291bGQgZWl0aGVyIGJlIGFuIGFic29sdXRlIG1vZHVsZSBuYW1lIChAYW5ndWxhci9jb3JlIGZvciBleGFtcGxlKSBvciBhIHJlbGF0aXZlIHBhdGguXG4gICAqL1xuICBmcm9tOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGRlY2xhcmF0aW9uIG9mIGEgc3ltYm9sLCBhbG9uZyB3aXRoIGluZm9ybWF0aW9uIGFib3V0IGhvdyBpdCB3YXMgaW1wb3J0ZWQgaW50byB0aGVcbiAqIGFwcGxpY2F0aW9uLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIERlY2xhcmF0aW9uIHtcbiAgLyoqXG4gICAqIFR5cGVTY3JpcHQgcmVmZXJlbmNlIHRvIHRoZSBkZWNsYXJhdGlvbiBpdHNlbGYuXG4gICAqL1xuICBub2RlOiB0cy5EZWNsYXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIGFic29sdXRlIG1vZHVsZSBwYXRoIGZyb20gd2hpY2ggdGhlIHN5bWJvbCB3YXMgaW1wb3J0ZWQgaW50byB0aGUgYXBwbGljYXRpb24sIGlmIHRoZSBzeW1ib2xcbiAgICogd2FzIGltcG9ydGVkIHZpYSBhbiBhYnNvbHV0ZSBtb2R1bGUgKGV2ZW4gdGhyb3VnaCBhIGNoYWluIG9mIHJlLWV4cG9ydHMpLiBJZiB0aGUgc3ltYm9sIGlzIHBhcnRcbiAgICogb2YgdGhlIGFwcGxpY2F0aW9uIGFuZCB3YXMgbm90IGltcG9ydGVkIGZyb20gYW4gYWJzb2x1dGUgcGF0aCwgdGhpcyB3aWxsIGJlIGBudWxsYC5cbiAgICovXG4gIHZpYU1vZHVsZTogc3RyaW5nfG51bGw7XG59XG5cbi8qKlxuICogQWJzdHJhY3RzIHJlZmxlY3Rpb24gb3BlcmF0aW9ucyBvbiBhIFR5cGVTY3JpcHQgQVNULlxuICpcbiAqIERlcGVuZGluZyBvbiB0aGUgZm9ybWF0IG9mIHRoZSBjb2RlIGJlaW5nIGludGVycHJldGVkLCBkaWZmZXJlbnQgY29uY2VwdHMgYXJlIHJlcHJlc2VudGVkIHdpdGhcbiAqIGRpZmZlcmVudCBzeW50YWN0aWNhbCBzdHJ1Y3R1cmVzLiBUaGUgYFJlZmxlY3Rpb25Ib3N0YCBhYnN0cmFjdHMgb3ZlciB0aG9zZSBkaWZmZXJlbmNlcyBhbmRcbiAqIHByZXNlbnRzIGEgc2luZ2xlIEFQSSBieSB3aGljaCB0aGUgY29tcGlsZXIgY2FuIHF1ZXJ5IHNwZWNpZmljIGluZm9ybWF0aW9uIGFib3V0IHRoZSBBU1QuXG4gKlxuICogQWxsIG9wZXJhdGlvbnMgb24gdGhlIGBSZWZsZWN0aW9uSG9zdGAgcmVxdWlyZSB0aGUgdXNlIG9mIFR5cGVTY3JpcHQgYHRzLk5vZGVgcyB3aXRoIGJpbmRpbmdcbiAqIGluZm9ybWF0aW9uIGFscmVhZHkgYXZhaWxhYmxlICh0aGF0IGlzLCBub2RlcyB0aGF0IGNvbWUgZnJvbSBhIGB0cy5Qcm9ncmFtYCB0aGF0IGhhcyBiZWVuXG4gKiB0eXBlLWNoZWNrZWQsIGFuZCBhcmUgbm90IHN5bnRoZXRpY2FsbHkgY3JlYXRlZCkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVmbGVjdGlvbkhvc3Qge1xuICAvKipcbiAgICogRXhhbWluZSBhIGRlY2xhcmF0aW9uIChmb3IgZXhhbXBsZSwgb2YgYSBjbGFzcyBvciBmdW5jdGlvbikgYW5kIHJldHVybiBtZXRhZGF0YSBhYm91dCBhbnlcbiAgICogZGVjb3JhdG9ycyBwcmVzZW50IG9uIHRoZSBkZWNsYXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIGRlY2xhcmF0aW9uIGEgVHlwZVNjcmlwdCBgdHMuRGVjbGFyYXRpb25gIG5vZGUgcmVwcmVzZW50aW5nIHRoZSBjbGFzcyBvciBmdW5jdGlvbiBvdmVyXG4gICAqIHdoaWNoIHRvIHJlZmxlY3QuIEZvciBleGFtcGxlLCBpZiB0aGUgaW50ZW50IGlzIHRvIHJlZmxlY3QgdGhlIGRlY29yYXRvcnMgb2YgYSBjbGFzcyBhbmQgdGhlXG4gICAqIHNvdXJjZSBpcyBpbiBFUzYgZm9ybWF0LCB0aGlzIHdpbGwgYmUgYSBgdHMuQ2xhc3NEZWNsYXJhdGlvbmAgbm9kZS4gSWYgdGhlIHNvdXJjZSBpcyBpbiBFUzVcbiAgICogZm9ybWF0LCB0aGlzIG1pZ2h0IGJlIGEgYHRzLlZhcmlhYmxlRGVjbGFyYXRpb25gIGFzIGNsYXNzZXMgaW4gRVM1IGFyZSByZXByZXNlbnRlZCBhcyB0aGVcbiAgICogcmVzdWx0IG9mIGFuIElJRkUgZXhlY3V0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBgRGVjb3JhdG9yYCBtZXRhZGF0YSBpZiBkZWNvcmF0b3JzIGFyZSBwcmVzZW50IG9uIHRoZSBkZWNsYXJhdGlvbiwgb3JcbiAgICogYG51bGxgIGlmIGVpdGhlciBubyBkZWNvcmF0b3JzIHdlcmUgcHJlc2VudCBvciBpZiB0aGUgZGVjbGFyYXRpb24gaXMgbm90IG9mIGEgZGVjb3JhYmxlIHR5cGUuXG4gICAqL1xuICBnZXREZWNvcmF0b3JzT2ZEZWNsYXJhdGlvbihkZWNsYXJhdGlvbjogdHMuRGVjbGFyYXRpb24pOiBEZWNvcmF0b3JbXXxudWxsO1xuXG4gIC8qKlxuICAgKiBFeGFtaW5lIGEgZGVjbGFyYXRpb24gd2hpY2ggc2hvdWxkIGJlIG9mIGEgY2xhc3MsIGFuZCByZXR1cm4gbWV0YWRhdGEgYWJvdXQgdGhlIG1lbWJlcnMgb2YgdGhlXG4gICAqIGNsYXNzLlxuICAgKlxuICAgKiBAcGFyYW0gZGVjbGFyYXRpb24gYSBUeXBlU2NyaXB0IGB0cy5EZWNsYXJhdGlvbmAgbm9kZSByZXByZXNlbnRpbmcgdGhlIGNsYXNzIG92ZXIgd2hpY2ggdG9cbiAgICogcmVmbGVjdC4gSWYgdGhlIHNvdXJjZSBpcyBpbiBFUzYgZm9ybWF0LCB0aGlzIHdpbGwgYmUgYSBgdHMuQ2xhc3NEZWNsYXJhdGlvbmAgbm9kZS4gSWYgdGhlXG4gICAqIHNvdXJjZSBpcyBpbiBFUzUgZm9ybWF0LCB0aGlzIG1pZ2h0IGJlIGEgYHRzLlZhcmlhYmxlRGVjbGFyYXRpb25gIGFzIGNsYXNzZXMgaW4gRVM1IGFyZVxuICAgKiByZXByZXNlbnRlZCBhcyB0aGUgcmVzdWx0IG9mIGFuIElJRkUgZXhlY3V0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBgQ2xhc3NNZW1iZXJgIG1ldGFkYXRhIHJlcHJlc2VudGluZyB0aGUgbWVtYmVycyBvZiB0aGUgY2xhc3MuXG4gICAqXG4gICAqIEB0aHJvd3MgaWYgYGRlY2xhcmF0aW9uYCBkb2VzIG5vdCByZXNvbHZlIHRvIGEgY2xhc3MgZGVjbGFyYXRpb24uXG4gICAqL1xuICBnZXRNZW1iZXJzT2ZDbGFzcyhjbGF6ejogdHMuRGVjbGFyYXRpb24pOiBDbGFzc01lbWJlcltdO1xuXG4gIC8qKlxuICAgKiBSZWZsZWN0IG92ZXIgdGhlIGNvbnN0cnVjdG9yIG9mIGEgY2xhc3MgYW5kIHJldHVybiBtZXRhZGF0YSBhYm91dCBpdHMgcGFyYW1ldGVycy5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgb25seSBsb29rcyBhdCB0aGUgY29uc3RydWN0b3Igb2YgYSBjbGFzcyBkaXJlY3RseSBhbmQgbm90IGF0IGFueSBpbmhlcml0ZWRcbiAgICogY29uc3RydWN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gZGVjbGFyYXRpb24gYSBUeXBlU2NyaXB0IGB0cy5EZWNsYXJhdGlvbmAgbm9kZSByZXByZXNlbnRpbmcgdGhlIGNsYXNzIG92ZXIgd2hpY2ggdG9cbiAgICogcmVmbGVjdC4gSWYgdGhlIHNvdXJjZSBpcyBpbiBFUzYgZm9ybWF0LCB0aGlzIHdpbGwgYmUgYSBgdHMuQ2xhc3NEZWNsYXJhdGlvbmAgbm9kZS4gSWYgdGhlXG4gICAqIHNvdXJjZSBpcyBpbiBFUzUgZm9ybWF0LCB0aGlzIG1pZ2h0IGJlIGEgYHRzLlZhcmlhYmxlRGVjbGFyYXRpb25gIGFzIGNsYXNzZXMgaW4gRVM1IGFyZVxuICAgKiByZXByZXNlbnRlZCBhcyB0aGUgcmVzdWx0IG9mIGFuIElJRkUgZXhlY3V0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBhbiBhcnJheSBvZiBgUGFyYW1ldGVyYCBtZXRhZGF0YSByZXByZXNlbnRpbmcgdGhlIHBhcmFtZXRlcnMgb2YgdGhlIGNvbnN0cnVjdG9yLCBpZlxuICAgKiBhIGNvbnN0cnVjdG9yIGV4aXN0cy4gSWYgdGhlIGNvbnN0cnVjdG9yIGV4aXN0cyBhbmQgaGFzIDAgcGFyYW1ldGVycywgdGhpcyBhcnJheSB3aWxsIGJlIGVtcHR5LlxuICAgKiBJZiB0aGUgY2xhc3MgaGFzIG5vIGNvbnN0cnVjdG9yLCB0aGlzIG1ldGhvZCByZXR1cm5zIGBudWxsYC5cbiAgICovXG4gIGdldENvbnN0cnVjdG9yUGFyYW1ldGVycyhkZWNsYXJhdGlvbjogdHMuRGVjbGFyYXRpb24pOiBDdG9yUGFyYW1ldGVyW118bnVsbDtcblxuICAvKipcbiAgICogUmVmbGVjdCBvdmVyIGEgZnVuY3Rpb24gYW5kIHJldHVybiBtZXRhZGF0YSBhYm91dCBpdHMgcGFyYW1ldGVycyBhbmQgYm9keS5cbiAgICpcbiAgICogRnVuY3Rpb25zIGluIFR5cGVTY3JpcHQgYW5kIEVTNSBjb2RlIGhhdmUgZGlmZmVyZW50IEFTVCByZXByZXNlbnRhdGlvbnMsIGluIHBhcnRpY3VsYXIgYXJvdW5kXG4gICAqIGRlZmF1bHQgdmFsdWVzIGZvciBwYXJhbWV0ZXJzLiBBIFR5cGVTY3JpcHQgZnVuY3Rpb24gaGFzIGl0cyBkZWZhdWx0IHZhbHVlIGFzIHRoZSBpbml0aWFsaXplclxuICAgKiBvbiB0aGUgcGFyYW1ldGVyIGRlY2xhcmF0aW9uLCB3aGVyZWFzIGFuIEVTNSBmdW5jdGlvbiBoYXMgaXRzIGRlZmF1bHQgdmFsdWUgc2V0IGluIGEgc3RhdGVtZW50XG4gICAqIG9mIHRoZSBmb3JtOlxuICAgKlxuICAgKiBpZiAocGFyYW0gPT09IHZvaWQgMCkgeyBwYXJhbSA9IDM7IH1cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWJzdHJhY3RzIG92ZXIgdGhlc2UgZGV0YWlscywgYW5kIGludGVycHJldHMgdGhlIGZ1bmN0aW9uIGRlY2xhcmF0aW9uIGFuZCBib2R5IHRvXG4gICAqIGV4dHJhY3QgcGFyYW1ldGVyIGRlZmF1bHQgdmFsdWVzIGFuZCB0aGUgXCJyZWFsXCIgYm9keS5cbiAgICpcbiAgICogQSBjdXJyZW50IGxpbWl0YXRpb24gaXMgdGhhdCB0aGlzIG1ldGFkYXRhIGhhcyBubyByZXByZXNlbnRhdGlvbiBmb3Igc2hvcnRoYW5kIGFzc2lnbm1lbnQgb2ZcbiAgICogcGFyYW1ldGVyIG9iamVjdHMgaW4gdGhlIGZ1bmN0aW9uIHNpZ25hdHVyZS5cbiAgICpcbiAgICogQHBhcmFtIGZuIGEgVHlwZVNjcmlwdCBgdHMuRGVjbGFyYXRpb25gIG5vZGUgcmVwcmVzZW50aW5nIHRoZSBmdW5jdGlvbiBvdmVyIHdoaWNoIHRvIHJlZmxlY3QuXG4gICAqXG4gICAqIEByZXR1cm5zIGEgYEZ1bmN0aW9uRGVmaW5pdGlvbmAgZ2l2aW5nIG1ldGFkYXRhIGFib3V0IHRoZSBmdW5jdGlvbiBkZWZpbml0aW9uLlxuICAgKi9cbiAgZ2V0RGVmaW5pdGlvbk9mRnVuY3Rpb248VCBleHRlbmRzIHRzLk1ldGhvZERlY2xhcmF0aW9ufHRzLkZ1bmN0aW9uRGVjbGFyYXRpb258XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRzLkZ1bmN0aW9uRXhwcmVzc2lvbj4oZm46IFQpOiBGdW5jdGlvbkRlZmluaXRpb248VD47XG5cbiAgLyoqXG4gICAqIERldGVybWluZSBpZiBhbiBpZGVudGlmaWVyIHdhcyBpbXBvcnRlZCBmcm9tIGFub3RoZXIgbW9kdWxlIGFuZCByZXR1cm4gYEltcG9ydGAgbWV0YWRhdGFcbiAgICogZGVzY3JpYmluZyBpdHMgb3JpZ2luLlxuICAgKlxuICAgKiBAcGFyYW0gaWQgYSBUeXBlU2NyaXB0IGB0cy5JZGVudGlmZXJgIHRvIHJlZmxlY3QuXG4gICAqXG4gICAqIEByZXR1cm5zIG1ldGFkYXRhIGFib3V0IHRoZSBgSW1wb3J0YCBpZiB0aGUgaWRlbnRpZmllciB3YXMgaW1wb3J0ZWQgZnJvbSBhbm90aGVyIG1vZHVsZSwgb3JcbiAgICogYG51bGxgIGlmIHRoZSBpZGVudGlmaWVyIGRvZXNuJ3QgcmVzb2x2ZSB0byBhbiBpbXBvcnQgYnV0IGluc3RlYWQgaXMgbG9jYWxseSBkZWZpbmVkLlxuICAgKi9cbiAgZ2V0SW1wb3J0T2ZJZGVudGlmaWVyKGlkOiB0cy5JZGVudGlmaWVyKTogSW1wb3J0fG51bGw7XG5cbiAgLyoqXG4gICAqIFRyYWNlIGFuIGlkZW50aWZpZXIgdG8gaXRzIGRlY2xhcmF0aW9uLCBpZiBwb3NzaWJsZS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYXR0ZW1wdHMgdG8gcmVzb2x2ZSB0aGUgZGVjbGFyYXRpb24gb2YgdGhlIGdpdmVuIGlkZW50aWZpZXIsIHRyYWNpbmcgYmFjayB0aHJvdWdoXG4gICAqIGltcG9ydHMgYW5kIHJlLWV4cG9ydHMgdW50aWwgdGhlIG9yaWdpbmFsIGRlY2xhcmF0aW9uIHN0YXRlbWVudCBpcyBmb3VuZC4gQSBgRGVjbGFyYXRpb25gXG4gICAqIG9iamVjdCBpcyByZXR1cm5lZCBpZiB0aGUgb3JpZ2luYWwgZGVjbGFyYXRpb24gaXMgZm91bmQsIG9yIGBudWxsYCBpcyByZXR1cm5lZCBvdGhlcndpc2UuXG4gICAqXG4gICAqIElmIHRoZSBkZWNsYXJhdGlvbiBpcyBpbiBhIGRpZmZlcmVudCBtb2R1bGUsIGFuZCB0aGF0IG1vZHVsZSBpcyBpbXBvcnRlZCB2aWEgYW4gYWJzb2x1dGUgcGF0aCxcbiAgICogdGhpcyBtZXRob2QgYWxzbyByZXR1cm5zIHRoZSBhYnNvbHV0ZSBwYXRoIG9mIHRoZSBpbXBvcnRlZCBtb2R1bGUuIEZvciBleGFtcGxlLCBpZiB0aGUgY29kZSBpczpcbiAgICpcbiAgICogYGBgXG4gICAqIGltcG9ydCB7Um91dGVyTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbiAgICpcbiAgICogZXhwb3J0IGNvbnN0IFJPVVRFUyA9IFJvdXRlck1vZHVsZS5mb3JSb290KFsuLi5dKTtcbiAgICogYGBgXG4gICAqXG4gICAqIGFuZCBpZiBgZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXJgIGlzIGNhbGxlZCBvbiBgUm91dGVyTW9kdWxlYCBpbiB0aGUgYFJPVVRFU2AgZXhwcmVzc2lvbixcbiAgICogdGhlbiBpdCB3b3VsZCB0cmFjZSBgUm91dGVyTW9kdWxlYCB2aWEgaXRzIGltcG9ydCBmcm9tIGBAYW5ndWxhci9jb3JlYCwgYW5kIG5vdGUgdGhhdCB0aGVcbiAgICogZGVmaW5pdGlvbiB3YXMgaW1wb3J0ZWQgZnJvbSBgQGFuZ3VsYXIvY29yZWAgaW50byB0aGUgYXBwbGljYXRpb24gd2hlcmUgaXQgd2FzIHJlZmVyZW5jZWQuXG4gICAqXG4gICAqIElmIHRoZSBkZWZpbml0aW9uIGlzIHJlLWV4cG9ydGVkIHNldmVyYWwgdGltZXMgZnJvbSBkaWZmZXJlbnQgYWJzb2x1dGUgbW9kdWxlIG5hbWVzLCBvbmx5XG4gICAqIHRoZSBmaXJzdCBvbmUgKHRoZSBvbmUgYnkgd2hpY2ggdGhlIGFwcGxpY2F0aW9uIHJlZmVycyB0byB0aGUgbW9kdWxlKSBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogVGhpcyBtb2R1bGUgbmFtZSBpcyByZXR1cm5lZCBpbiB0aGUgYHZpYU1vZHVsZWAgZmllbGQgb2YgdGhlIGBEZWNsYXJhdGlvbmAuIElmIFRoZSBkZWNsYXJhdGlvblxuICAgKiBpcyByZWxhdGl2ZSB0byB0aGUgYXBwbGljYXRpb24gaXRzZWxmIGFuZCB0aGVyZSB3YXMgbm8gaW1wb3J0IHRocm91Z2ggYW4gYWJzb2x1dGUgcGF0aCwgdGhlblxuICAgKiBgdmlhTW9kdWxlYCBpcyBgbnVsbGAuXG4gICAqXG4gICAqIEBwYXJhbSBpZCBhIFR5cGVTY3JpcHQgYHRzLklkZW50aWZpZXJgIHRvIHRyYWNlIGJhY2sgdG8gYSBkZWNsYXJhdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgbWV0YWRhdGEgYWJvdXQgdGhlIGBEZWNsYXJhdGlvbmAgaWYgdGhlIG9yaWdpbmFsIGRlY2xhcmF0aW9uIGlzIGZvdW5kLCBvciBgbnVsbGBcbiAgICogb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0RGVjbGFyYXRpb25PZklkZW50aWZpZXIoaWQ6IHRzLklkZW50aWZpZXIpOiBEZWNsYXJhdGlvbnxudWxsO1xuXG4gIC8qKlxuICAgKiBDb2xsZWN0IHRoZSBkZWNsYXJhdGlvbnMgZXhwb3J0ZWQgZnJvbSBhIG1vZHVsZSBieSBuYW1lLlxuICAgKlxuICAgKiBJdGVyYXRlcyBvdmVyIHRoZSBleHBvcnRzIG9mIGEgbW9kdWxlIChpbmNsdWRpbmcgcmUtZXhwb3J0cykgYW5kIHJldHVybnMgYSBtYXAgb2YgZXhwb3J0XG4gICAqIG5hbWUgdG8gaXRzIGBEZWNsYXJhdGlvbmAuIElmIGFuIGV4cG9ydGVkIHZhbHVlIGlzIGl0c2VsZiByZS1leHBvcnRlZCBmcm9tIGFub3RoZXIgbW9kdWxlLFxuICAgKiB0aGUgYERlY2xhcmF0aW9uYCdzIGB2aWFNb2R1bGVgIHdpbGwgcmVmbGVjdCB0aGF0LlxuICAgKlxuICAgKiBAcGFyYW0gbm9kZSBhIFR5cGVTY3JpcHQgYHRzLk5vZGVgIHJlcHJlc2VudGluZyB0aGUgbW9kdWxlIChmb3IgZXhhbXBsZSBhIGB0cy5Tb3VyY2VGaWxlYCkgZm9yXG4gICAqIHdoaWNoIHRvIGNvbGxlY3QgZXhwb3J0cy5cbiAgICpcbiAgICogQHJldHVybnMgYSBtYXAgb2YgYERlY2xhcmF0aW9uYHMgZm9yIHRoZSBtb2R1bGUncyBleHBvcnRzLCBieSBuYW1lLlxuICAgKi9cbiAgZ2V0RXhwb3J0c09mTW9kdWxlKG1vZHVsZTogdHMuTm9kZSk6IE1hcDxzdHJpbmcsIERlY2xhcmF0aW9uPnxudWxsO1xuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiBub2RlIGFjdHVhbGx5IHJlcHJlc2VudHMgYSBjbGFzcy5cbiAgICovXG4gIGlzQ2xhc3Mobm9kZTogdHMuTm9kZSk6IG5vZGUgaXMgdHMuTmFtZWREZWNsYXJhdGlvbjtcblxuICBoYXNCYXNlQ2xhc3Mobm9kZTogdHMuRGVjbGFyYXRpb24pOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIG51bWJlciBvZiBnZW5lcmljIHR5cGUgcGFyYW1ldGVycyBvZiBhIGdpdmVuIGNsYXNzLlxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbnVtYmVyIG9mIHR5cGUgcGFyYW1ldGVycyBvZiB0aGUgY2xhc3MsIGlmIGtub3duLCBvciBgbnVsbGAgaWYgdGhlIGRlY2xhcmF0aW9uXG4gICAqIGlzIG5vdCBhIGNsYXNzIG9yIGhhcyBhbiB1bmtub3duIG51bWJlciBvZiB0eXBlIHBhcmFtZXRlcnMuXG4gICAqL1xuICBnZXRHZW5lcmljQXJpdHlPZkNsYXNzKGNsYXp6OiB0cy5EZWNsYXJhdGlvbik6IG51bWJlcnxudWxsO1xuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBhc3NpZ25lZCB2YWx1ZSBvZiBhIHZhcmlhYmxlIGRlY2xhcmF0aW9uLlxuICAgKlxuICAgKiBOb3JtYWxseSB0aGlzIHdpbGwgYmUgdGhlIGluaXRpYWxpemVyIG9mIHRoZSBkZWNsYXJhdGlvbiwgYnV0IHdoZXJlIHRoZSB2YXJpYWJsZSBpc1xuICAgKiBub3QgYSBgY29uc3RgIHdlIG1heSBuZWVkIHRvIGxvb2sgZWxzZXdoZXJlIGZvciB0aGUgdmFyaWFibGUncyB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIGRlY2xhcmF0aW9uIGEgVHlwZVNjcmlwdCB2YXJpYWJsZSBkZWNsYXJhdGlvbiwgd2hvc2UgdmFsdWUgd2Ugd2FudC5cbiAgICogQHJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSB2YXJpYWJsZSwgYXMgYSBUeXBlU2NyaXB0IGV4cHJlc3Npb24gbm9kZSwgb3IgYHVuZGVmaW5lZGBcbiAgICogaWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBjb21wdXRlZC5cbiAgICovXG4gIGdldFZhcmlhYmxlVmFsdWUoZGVjbGFyYXRpb246IHRzLlZhcmlhYmxlRGVjbGFyYXRpb24pOiB0cy5FeHByZXNzaW9ufG51bGw7XG5cbiAgLyoqXG4gICAqIFRha2UgYW4gZXhwb3J0ZWQgZGVjbGFyYXRpb24gKG1heWJlIGEgY2xhc3MgZG93bi1sZXZlbGVkIHRvIGEgdmFyaWFibGUpIGFuZCBsb29rIHVwIHRoZVxuICAgKiBkZWNsYXJhdGlvbiBvZiBpdHMgdHlwZSBpbiBhIHNlcGFyYXRlIC5kLnRzIHRyZWUuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgYWxsb3dlZCB0byByZXR1cm4gYG51bGxgIGlmIHRoZSBjdXJyZW50IGNvbXBpbGF0aW9uIHVuaXQgZG9lcyBub3QgaGF2ZSBhXG4gICAqIHNlcGFyYXRlIC5kLnRzIHRyZWUuIFdoZW4gY29tcGlsaW5nIFR5cGVTY3JpcHQgY29kZSB0aGlzIGlzIGFsd2F5cyB0aGUgY2FzZSwgc2luY2UgLmQudHMgZmlsZXNcbiAgICogYXJlIHByb2R1Y2VkIG9ubHkgZHVyaW5nIHRoZSBlbWl0IG9mIHN1Y2ggYSBjb21waWxhdGlvbi4gV2hlbiBjb21waWxpbmcgLmpzIGNvZGUsIGhvd2V2ZXIsXG4gICAqIHRoZXJlIGlzIGZyZXF1ZW50bHkgYSBwYXJhbGxlbCAuZC50cyB0cmVlIHdoaWNoIHRoaXMgbWV0aG9kIGV4cG9zZXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgYHRzLkRlY2xhcmF0aW9uYCByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gbWF5IG5vdCBiZSBmcm9tIHRoZSBzYW1lXG4gICAqIGB0cy5Qcm9ncmFtYCBhcyB0aGUgaW5wdXQgZGVjbGFyYXRpb24uXG4gICAqL1xuICBnZXREdHNEZWNsYXJhdGlvbihkZWNsYXJhdGlvbjogdHMuRGVjbGFyYXRpb24pOiB0cy5EZWNsYXJhdGlvbnxudWxsO1xufVxuIl19