/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '../di/injection_token';
import { makeParamDecorator, makePropDecorator } from '../util/decorators';
/**
 * A DI token that you can use to create a virtual [provider](guide/glossary#provider)
 * that will populate the `entryComponents` field of components and NgModules
 * based on its `useValue` property value.
 * All components that are referenced in the `useValue` value (either directly
 * or in a nested array or map) are added to the `entryComponents` property.
 *
 * \@usageNotes
 *
 * The following example shows how the router can populate the `entryComponents`
 * field of an NgModule based on a router configuration that refers
 * to components.
 *
 * ```typescript
 * // helper function inside the router
 * function provideRoutes(routes) {
 *   return [
 *     {provide: ROUTES, useValue: routes},
 *     {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: routes, multi: true}
 *   ];
 * }
 *
 * // user code
 * let routes = [
 *   {path: '/root', component: RootComp},
 *   {path: '/teams', component: TeamsComp}
 * ];
 *
 * \@NgModule({
 *   providers: [provideRoutes(routes)]
 * })
 * class ModuleWithRoutes {}
 * ```
 *
 * \@publicApi
 * @type {?}
 */
export const ANALYZE_FOR_ENTRY_COMPONENTS = new InjectionToken('AnalyzeForEntryComponents');
/**
 * Type of the `Attribute` decorator / constructor function.
 *
 * \@publicApi
 * @record
 */
export function AttributeDecorator() { }
// WARNING: interface has both a type and a value, skipping emit
/**
 * Attribute decorator and metadata.
 *
 * \@Annotation
 * \@publicApi
 * @type {?}
 */
export const Attribute = makeParamDecorator('Attribute', (attributeName) => ({ attributeName }));
// WARNING: interface has both a type and a value, skipping emit
/**
 * Base class for query metadata.
 *
 * @see `ContentChildren`.
 * @see `ContentChild`.
 * @see `ViewChildren`.
 * @see `ViewChild`.
 *
 * \@publicApi
 * @abstract
 */
export class Query {
}
/**
 * Type of the ContentChildren decorator / constructor function.
 *
 * @see `ContentChildren`.
 * \@publicApi
 * @record
 */
export function ContentChildrenDecorator() { }
/**
 * ContentChildren decorator and metadata.
 *
 *
 * \@Annotation
 * \@publicApi
 * @type {?}
 */
export const ContentChildren = makePropDecorator('ContentChildren', (selector, data = {}) => (Object.assign({ selector, first: false, isViewQuery: false, descendants: false }, data)), Query);
/**
 * Type of the ContentChild decorator / constructor function.
 *
 * \@publicApi
 * @record
 */
export function ContentChildDecorator() { }
/**
 * ContentChild decorator and metadata.
 *
 *
 * \@Annotation
 *
 * \@publicApi
 * @type {?}
 */
export const ContentChild = makePropDecorator('ContentChild', (selector, data = {}) => (Object.assign({ selector, first: true, isViewQuery: false, descendants: true }, data)), Query);
/**
 * Type of the ViewChildren decorator / constructor function.
 *
 * @see `ViewChildren`.
 *
 * \@publicApi
 * @record
 */
export function ViewChildrenDecorator() { }
/**
 * ViewChildren decorator and metadata.
 *
 * \@Annotation
 * \@publicApi
 * @type {?}
 */
export const ViewChildren = makePropDecorator('ViewChildren', (selector, data = {}) => (Object.assign({ selector, first: false, isViewQuery: true, descendants: true }, data)), Query);
/**
 * Type of the ViewChild decorator / constructor function.
 *
 * @see `ViewChild`.
 * \@publicApi
 * @record
 */
export function ViewChildDecorator() { }
/**
 * ViewChild decorator and metadata.
 *
 * \@Annotation
 * \@publicApi
 * @type {?}
 */
export const ViewChild = makePropDecorator('ViewChild', (selector, data) => (Object.assign({ selector, first: true, isViewQuery: true, descendants: true }, data)), Query);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9tZXRhZGF0YS9kaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ3pFLE1BQU0sT0FBTyw0QkFBNEIsR0FBRyxJQUFJLGNBQWMsQ0FBTSwyQkFBMkIsQ0FBQzs7Ozs7OztBQU9oRyx3Q0F1QkM7Ozs7Ozs7OztBQXFCRCxNQUFNLE9BQU8sU0FBUyxHQUNsQixrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxhQUFzQixFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUMsYUFBYSxFQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQXlCbEYsTUFBTSxPQUFnQixLQUFLO0NBQUc7Ozs7Ozs7O0FBUTlCLDhDQWtDQzs7Ozs7Ozs7O0FBa0JELE1BQU0sT0FBTyxlQUFlLEdBQTZCLGlCQUFpQixDQUN0RSxpQkFBaUIsRUFDakIsQ0FBQyxRQUFjLEVBQUUsT0FBWSxFQUFFLEVBQUUsRUFBRSxDQUMvQixpQkFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLElBQUssSUFBSSxFQUFFLEVBQy9FLEtBQUssQ0FBQzs7Ozs7OztBQU9WLDJDQTRCQzs7Ozs7Ozs7OztBQWlCRCxNQUFNLE9BQU8sWUFBWSxHQUEwQixpQkFBaUIsQ0FDaEUsY0FBYyxFQUFFLENBQUMsUUFBYyxFQUFFLE9BQVksRUFBRSxFQUFFLEVBQUUsQ0FDL0IsaUJBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxJQUFLLElBQUksRUFBRSxFQUM3RixLQUFLLENBQUM7Ozs7Ozs7OztBQVNWLDJDQTZCQzs7Ozs7Ozs7QUFlRCxNQUFNLE9BQU8sWUFBWSxHQUEwQixpQkFBaUIsQ0FDaEUsY0FBYyxFQUFFLENBQUMsUUFBYyxFQUFFLE9BQVksRUFBRSxFQUFFLEVBQUUsQ0FDL0IsaUJBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxJQUFLLElBQUksRUFBRSxFQUM3RixLQUFLLENBQUM7Ozs7Ozs7O0FBUVYsd0NBMENDOzs7Ozs7OztBQWVELE1BQU0sT0FBTyxTQUFTLEdBQXVCLGlCQUFpQixDQUMxRCxXQUFXLEVBQUUsQ0FBQyxRQUFhLEVBQUUsSUFBUyxFQUFFLEVBQUUsQ0FDekIsaUJBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxJQUFLLElBQUksRUFBRSxFQUN6RixLQUFLLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0aW9uVG9rZW59IGZyb20gJy4uL2RpL2luamVjdGlvbl90b2tlbic7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uL3R5cGUnO1xuaW1wb3J0IHttYWtlUGFyYW1EZWNvcmF0b3IsIG1ha2VQcm9wRGVjb3JhdG9yfSBmcm9tICcuLi91dGlsL2RlY29yYXRvcnMnO1xuXG4vKipcbiAqIEEgREkgdG9rZW4gdGhhdCB5b3UgY2FuIHVzZSB0byBjcmVhdGUgYSB2aXJ0dWFsIFtwcm92aWRlcl0oZ3VpZGUvZ2xvc3NhcnkjcHJvdmlkZXIpXG4gKiB0aGF0IHdpbGwgcG9wdWxhdGUgdGhlIGBlbnRyeUNvbXBvbmVudHNgIGZpZWxkIG9mIGNvbXBvbmVudHMgYW5kIE5nTW9kdWxlc1xuICogYmFzZWQgb24gaXRzIGB1c2VWYWx1ZWAgcHJvcGVydHkgdmFsdWUuXG4gKiBBbGwgY29tcG9uZW50cyB0aGF0IGFyZSByZWZlcmVuY2VkIGluIHRoZSBgdXNlVmFsdWVgIHZhbHVlIChlaXRoZXIgZGlyZWN0bHlcbiAqIG9yIGluIGEgbmVzdGVkIGFycmF5IG9yIG1hcCkgYXJlIGFkZGVkIHRvIHRoZSBgZW50cnlDb21wb25lbnRzYCBwcm9wZXJ0eS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdGhlIHJvdXRlciBjYW4gcG9wdWxhdGUgdGhlIGBlbnRyeUNvbXBvbmVudHNgXG4gKiBmaWVsZCBvZiBhbiBOZ01vZHVsZSBiYXNlZCBvbiBhIHJvdXRlciBjb25maWd1cmF0aW9uIHRoYXQgcmVmZXJzXG4gKiB0byBjb21wb25lbnRzLlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIC8vIGhlbHBlciBmdW5jdGlvbiBpbnNpZGUgdGhlIHJvdXRlclxuICogZnVuY3Rpb24gcHJvdmlkZVJvdXRlcyhyb3V0ZXMpIHtcbiAqICAgcmV0dXJuIFtcbiAqICAgICB7cHJvdmlkZTogUk9VVEVTLCB1c2VWYWx1ZTogcm91dGVzfSxcbiAqICAgICB7cHJvdmlkZTogQU5BTFlaRV9GT1JfRU5UUllfQ09NUE9ORU5UUywgdXNlVmFsdWU6IHJvdXRlcywgbXVsdGk6IHRydWV9XG4gKiAgIF07XG4gKiB9XG4gKlxuICogLy8gdXNlciBjb2RlXG4gKiBsZXQgcm91dGVzID0gW1xuICogICB7cGF0aDogJy9yb290JywgY29tcG9uZW50OiBSb290Q29tcH0sXG4gKiAgIHtwYXRoOiAnL3RlYW1zJywgY29tcG9uZW50OiBUZWFtc0NvbXB9XG4gKiBdO1xuICpcbiAqIEBOZ01vZHVsZSh7XG4gKiAgIHByb3ZpZGVyczogW3Byb3ZpZGVSb3V0ZXMocm91dGVzKV1cbiAqIH0pXG4gKiBjbGFzcyBNb2R1bGVXaXRoUm91dGVzIHt9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBBTkFMWVpFX0ZPUl9FTlRSWV9DT01QT05FTlRTID0gbmV3IEluamVjdGlvblRva2VuPGFueT4oJ0FuYWx5emVGb3JFbnRyeUNvbXBvbmVudHMnKTtcblxuLyoqXG4gKiBUeXBlIG9mIHRoZSBgQXR0cmlidXRlYCBkZWNvcmF0b3IgLyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXR0cmlidXRlRGVjb3JhdG9yIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGF0IGEgY29uc3RhbnQgYXR0cmlidXRlIHZhbHVlIHNob3VsZCBiZSBpbmplY3RlZC5cbiAgICpcbiAgICogVGhlIGRpcmVjdGl2ZSBjYW4gaW5qZWN0IGNvbnN0YW50IHN0cmluZyBsaXRlcmFscyBvZiBob3N0IGVsZW1lbnQgYXR0cmlidXRlcy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICogU3VwcG9zZSB3ZSBoYXZlIGFuIGA8aW5wdXQ+YCBlbGVtZW50IGFuZCB3YW50IHRvIGtub3cgaXRzIGB0eXBlYC5cbiAgICpcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgdHlwZT1cInRleHRcIj5cbiAgICogYGBgXG4gICAqXG4gICAqIEEgZGVjb3JhdG9yIGNhbiBpbmplY3Qgc3RyaW5nIGxpdGVyYWwgYHRleHRgIGFzIGluIHRoZSBmb2xsb3dpbmcgZXhhbXBsZS5cbiAgICpcbiAgICoge0BleGFtcGxlIGNvcmUvdHMvbWV0YWRhdGEvbWV0YWRhdGEudHMgcmVnaW9uPSdhdHRyaWJ1dGVNZXRhZGF0YSd9XG4gICAqXG4gICAqIEBwdWJsaWNBcGlcbiAgICovXG4gIChuYW1lOiBzdHJpbmcpOiBhbnk7XG4gIG5ldyAobmFtZTogc3RyaW5nKTogQXR0cmlidXRlO1xufVxuXG5cbi8qKlxuICogVHlwZSBvZiB0aGUgQXR0cmlidXRlIG1ldGFkYXRhLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBdHRyaWJ1dGUge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB0byBiZSBpbmplY3RlZCBpbnRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGF0dHJpYnV0ZU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQXR0cmlidXRlIGRlY29yYXRvciBhbmQgbWV0YWRhdGEuXG4gKlxuICogQEFubm90YXRpb25cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IEF0dHJpYnV0ZTogQXR0cmlidXRlRGVjb3JhdG9yID1cbiAgICBtYWtlUGFyYW1EZWNvcmF0b3IoJ0F0dHJpYnV0ZScsIChhdHRyaWJ1dGVOYW1lPzogc3RyaW5nKSA9PiAoe2F0dHJpYnV0ZU5hbWV9KSk7XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgUXVlcnkgbWV0YWRhdGEuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5IHtcbiAgZGVzY2VuZGFudHM6IGJvb2xlYW47XG4gIGZpcnN0OiBib29sZWFuO1xuICByZWFkOiBhbnk7XG4gIGlzVmlld1F1ZXJ5OiBib29sZWFuO1xuICBzZWxlY3RvcjogYW55O1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHF1ZXJ5IG1ldGFkYXRhLlxuICpcbiAqIEBzZWUgYENvbnRlbnRDaGlsZHJlbmAuXG4gKiBAc2VlIGBDb250ZW50Q2hpbGRgLlxuICogQHNlZSBgVmlld0NoaWxkcmVuYC5cbiAqIEBzZWUgYFZpZXdDaGlsZGAuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUXVlcnkge31cblxuLyoqXG4gKiBUeXBlIG9mIHRoZSBDb250ZW50Q2hpbGRyZW4gZGVjb3JhdG9yIC8gY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gKlxuICogQHNlZSBgQ29udGVudENoaWxkcmVuYC5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250ZW50Q2hpbGRyZW5EZWNvcmF0b3Ige1xuICAvKipcbiAgICogQ29uZmlndXJlcyBhIGNvbnRlbnQgcXVlcnkuXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIENvbnRlbnRDaGlsZHJlbiB0byBnZXQgdGhlIGBRdWVyeUxpc3RgIG9mIGVsZW1lbnRzIG9yIGRpcmVjdGl2ZXMgZnJvbSB0aGVcbiAgICogY29udGVudCBET00uIEFueSB0aW1lIGEgY2hpbGQgZWxlbWVudCBpcyBhZGRlZCwgcmVtb3ZlZCwgb3IgbW92ZWQsIHRoZSBxdWVyeSBsaXN0IHdpbGwgYmVcbiAgICogdXBkYXRlZCwgYW5kIHRoZSBjaGFuZ2VzIG9ic2VydmFibGUgb2YgdGhlIHF1ZXJ5IGxpc3Qgd2lsbCBlbWl0IGEgbmV3IHZhbHVlLlxuICAgKlxuICAgKiBDb250ZW50IHF1ZXJpZXMgYXJlIHNldCBiZWZvcmUgdGhlIGBuZ0FmdGVyQ29udGVudEluaXRgIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAgICpcbiAgICogKipNZXRhZGF0YSBQcm9wZXJ0aWVzKio6XG4gICAqXG4gICAqICogKipzZWxlY3RvcioqIC0gdGhlIGRpcmVjdGl2ZSB0eXBlIG9yIHRoZSBuYW1lIHVzZWQgZm9yIHF1ZXJ5aW5nLlxuICAgKiAqICoqZGVzY2VuZGFudHMqKiAtIGluY2x1ZGUgb25seSBkaXJlY3QgY2hpbGRyZW4gb3IgYWxsIGRlc2NlbmRhbnRzLlxuICAgKiAqICoqcmVhZCoqIC0gcmVhZCBhIGRpZmZlcmVudCB0b2tlbiBmcm9tIHRoZSBxdWVyaWVkIGVsZW1lbnRzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgQmFzaWMgRXhhbXBsZVxuICAgKlxuICAgKiBIZXJlIGlzIGEgc2ltcGxlIGRlbW9uc3RyYXRpb24gb2YgaG93IHRoZSBgQ29udGVudENoaWxkcmVuYCBkZWNvcmF0b3IgY2FuIGJlIHVzZWQuXG4gICAqXG4gICAqIHtAZXhhbXBsZSBjb3JlL2RpL3RzL2NvbnRlbnRDaGlsZHJlbi9jb250ZW50X2NoaWxkcmVuX2hvd3RvLnRzIHJlZ2lvbj0nSG93VG8nfVxuICAgKlxuICAgKiAjIyMgVGFiLXBhbmUgRXhhbXBsZVxuICAgKlxuICAgKiBIZXJlIGlzIGEgc2xpZ2h0bHkgbW9yZSByZWFsaXN0aWMgZXhhbXBsZSB0aGF0IHNob3dzIGhvdyBgQ29udGVudENoaWxkcmVuYCBkZWNvcmF0b3JzXG4gICAqIGNhbiBiZSB1c2VkIHRvIGltcGxlbWVudCBhIHRhYiBwYW5lIGNvbXBvbmVudC5cbiAgICpcbiAgICoge0BleGFtcGxlIGNvcmUvZGkvdHMvY29udGVudENoaWxkcmVuL2NvbnRlbnRfY2hpbGRyZW5fZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gICAqXG4gICAqIEBBbm5vdGF0aW9uXG4gICAqL1xuICAoc2VsZWN0b3I6IFR5cGU8YW55PnxGdW5jdGlvbnxzdHJpbmcsIG9wdHM/OiB7ZGVzY2VuZGFudHM/OiBib29sZWFuLCByZWFkPzogYW55fSk6IGFueTtcbiAgbmV3IChzZWxlY3RvcjogVHlwZTxhbnk+fEZ1bmN0aW9ufHN0cmluZywgb3B0cz86IHtkZXNjZW5kYW50cz86IGJvb2xlYW4sIHJlYWQ/OiBhbnl9KTogUXVlcnk7XG59XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgQ29udGVudENoaWxkcmVuIG1ldGFkYXRhLlxuICpcbiAqXG4gKiBAQW5ub3RhdGlvblxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBDb250ZW50Q2hpbGRyZW4gPSBRdWVyeTtcblxuLyoqXG4gKiBDb250ZW50Q2hpbGRyZW4gZGVjb3JhdG9yIGFuZCBtZXRhZGF0YS5cbiAqXG4gKlxuICogQEFubm90YXRpb25cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IENvbnRlbnRDaGlsZHJlbjogQ29udGVudENoaWxkcmVuRGVjb3JhdG9yID0gbWFrZVByb3BEZWNvcmF0b3IoXG4gICAgJ0NvbnRlbnRDaGlsZHJlbicsXG4gICAgKHNlbGVjdG9yPzogYW55LCBkYXRhOiBhbnkgPSB7fSkgPT5cbiAgICAgICAgKHtzZWxlY3RvciwgZmlyc3Q6IGZhbHNlLCBpc1ZpZXdRdWVyeTogZmFsc2UsIGRlc2NlbmRhbnRzOiBmYWxzZSwgLi4uZGF0YX0pLFxuICAgIFF1ZXJ5KTtcblxuLyoqXG4gKiBUeXBlIG9mIHRoZSBDb250ZW50Q2hpbGQgZGVjb3JhdG9yIC8gY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbnRlbnRDaGlsZERlY29yYXRvciB7XG4gIC8qKlxuICAgKiBDb25maWd1cmVzIGEgY29udGVudCBxdWVyeS5cbiAgICpcbiAgICogWW91IGNhbiB1c2UgQ29udGVudENoaWxkIHRvIGdldCB0aGUgZmlyc3QgZWxlbWVudCBvciB0aGUgZGlyZWN0aXZlIG1hdGNoaW5nIHRoZSBzZWxlY3RvciBmcm9tXG4gICAqIHRoZSBjb250ZW50IERPTS4gSWYgdGhlIGNvbnRlbnQgRE9NIGNoYW5nZXMsIGFuZCBhIG5ldyBjaGlsZCBtYXRjaGVzIHRoZSBzZWxlY3RvcixcbiAgICogdGhlIHByb3BlcnR5IHdpbGwgYmUgdXBkYXRlZC5cbiAgICpcbiAgICogQ29udGVudCBxdWVyaWVzIGFyZSBzZXQgYmVmb3JlIHRoZSBgbmdBZnRlckNvbnRlbnRJbml0YCBjYWxsYmFjayBpcyBjYWxsZWQuXG4gICAqXG4gICAqICoqTWV0YWRhdGEgUHJvcGVydGllcyoqOlxuICAgKlxuICAgKiAqICoqc2VsZWN0b3IqKiAtIHRoZSBkaXJlY3RpdmUgdHlwZSBvciB0aGUgbmFtZSB1c2VkIGZvciBxdWVyeWluZy5cbiAgICogKiAqKnJlYWQqKiAtIHJlYWQgYSBkaWZmZXJlbnQgdG9rZW4gZnJvbSB0aGUgcXVlcmllZCBlbGVtZW50LlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgY29yZS9kaS90cy9jb250ZW50Q2hpbGQvY29udGVudF9jaGlsZF9ob3d0by50cyByZWdpb249J0hvd1RvJ31cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIGNvcmUvZGkvdHMvY29udGVudENoaWxkL2NvbnRlbnRfY2hpbGRfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gICAqXG4gICAqIEBBbm5vdGF0aW9uXG4gICAqL1xuICAoc2VsZWN0b3I6IFR5cGU8YW55PnxGdW5jdGlvbnxzdHJpbmcsIG9wdHM/OiB7cmVhZD86IGFueX0pOiBhbnk7XG4gIG5ldyAoc2VsZWN0b3I6IFR5cGU8YW55PnxGdW5jdGlvbnxzdHJpbmcsIG9wdHM/OiB7cmVhZD86IGFueX0pOiBDb250ZW50Q2hpbGQ7XG59XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgQ29udGVudENoaWxkIG1ldGFkYXRhLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgQ29udGVudENoaWxkID0gUXVlcnk7XG5cbi8qKlxuICogQ29udGVudENoaWxkIGRlY29yYXRvciBhbmQgbWV0YWRhdGEuXG4gKlxuICpcbiAqIEBBbm5vdGF0aW9uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgQ29udGVudENoaWxkOiBDb250ZW50Q2hpbGREZWNvcmF0b3IgPSBtYWtlUHJvcERlY29yYXRvcihcbiAgICAnQ29udGVudENoaWxkJywgKHNlbGVjdG9yPzogYW55LCBkYXRhOiBhbnkgPSB7fSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICh7c2VsZWN0b3IsIGZpcnN0OiB0cnVlLCBpc1ZpZXdRdWVyeTogZmFsc2UsIGRlc2NlbmRhbnRzOiB0cnVlLCAuLi5kYXRhfSksXG4gICAgUXVlcnkpO1xuXG4vKipcbiAqIFR5cGUgb2YgdGhlIFZpZXdDaGlsZHJlbiBkZWNvcmF0b3IgLyBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAqXG4gKiBAc2VlIGBWaWV3Q2hpbGRyZW5gLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWaWV3Q2hpbGRyZW5EZWNvcmF0b3Ige1xuICAvKipcbiAgICogQ29uZmlndXJlcyBhIHZpZXcgcXVlcnkuXG4gICAqXG4gICAqIFlvdSBjYW4gdXNlIFZpZXdDaGlsZHJlbiB0byBnZXQgdGhlIGBRdWVyeUxpc3RgIG9mIGVsZW1lbnRzIG9yIGRpcmVjdGl2ZXMgZnJvbSB0aGVcbiAgICogdmlldyBET00uIEFueSB0aW1lIGEgY2hpbGQgZWxlbWVudCBpcyBhZGRlZCwgcmVtb3ZlZCwgb3IgbW92ZWQsIHRoZSBxdWVyeSBsaXN0IHdpbGwgYmUgdXBkYXRlZCxcbiAgICogYW5kIHRoZSBjaGFuZ2VzIG9ic2VydmFibGUgb2YgdGhlIHF1ZXJ5IGxpc3Qgd2lsbCBlbWl0IGEgbmV3IHZhbHVlLlxuICAgKlxuICAgKiBWaWV3IHF1ZXJpZXMgYXJlIHNldCBiZWZvcmUgdGhlIGBuZ0FmdGVyVmlld0luaXRgIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAgICpcbiAgICogKipNZXRhZGF0YSBQcm9wZXJ0aWVzKio6XG4gICAqXG4gICAqICogKipzZWxlY3RvcioqIC0gdGhlIGRpcmVjdGl2ZSB0eXBlIG9yIHRoZSBuYW1lIHVzZWQgZm9yIHF1ZXJ5aW5nLlxuICAgKiAqICoqcmVhZCoqIC0gcmVhZCBhIGRpZmZlcmVudCB0b2tlbiBmcm9tIHRoZSBxdWVyaWVkIGVsZW1lbnRzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgY29yZS9kaS90cy92aWV3Q2hpbGRyZW4vdmlld19jaGlsZHJlbl9ob3d0by50cyByZWdpb249J0hvd1RvJ31cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIGNvcmUvZGkvdHMvdmlld0NoaWxkcmVuL3ZpZXdfY2hpbGRyZW5fZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gICAqXG4gICAqIEBBbm5vdGF0aW9uXG4gICAqL1xuICAoc2VsZWN0b3I6IFR5cGU8YW55PnxGdW5jdGlvbnxzdHJpbmcsIG9wdHM/OiB7cmVhZD86IGFueX0pOiBhbnk7XG4gIG5ldyAoc2VsZWN0b3I6IFR5cGU8YW55PnxGdW5jdGlvbnxzdHJpbmcsIG9wdHM/OiB7cmVhZD86IGFueX0pOiBWaWV3Q2hpbGRyZW47XG59XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgVmlld0NoaWxkcmVuIG1ldGFkYXRhLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgVmlld0NoaWxkcmVuID0gUXVlcnk7XG5cbi8qKlxuICogVmlld0NoaWxkcmVuIGRlY29yYXRvciBhbmQgbWV0YWRhdGEuXG4gKlxuICogQEFubm90YXRpb25cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IFZpZXdDaGlsZHJlbjogVmlld0NoaWxkcmVuRGVjb3JhdG9yID0gbWFrZVByb3BEZWNvcmF0b3IoXG4gICAgJ1ZpZXdDaGlsZHJlbicsIChzZWxlY3Rvcj86IGFueSwgZGF0YTogYW55ID0ge30pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAoe3NlbGVjdG9yLCBmaXJzdDogZmFsc2UsIGlzVmlld1F1ZXJ5OiB0cnVlLCBkZXNjZW5kYW50czogdHJ1ZSwgLi4uZGF0YX0pLFxuICAgIFF1ZXJ5KTtcblxuLyoqXG4gKiBUeXBlIG9mIHRoZSBWaWV3Q2hpbGQgZGVjb3JhdG9yIC8gY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gKlxuICogQHNlZSBgVmlld0NoaWxkYC5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWaWV3Q2hpbGREZWNvcmF0b3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFByb3BlcnR5IGRlY29yYXRvciB0aGF0IGNvbmZpZ3VyZXMgYSB2aWV3IHF1ZXJ5LlxuICAgKiBUaGUgY2hhbmdlIGRldGVjdG9yIGxvb2tzIGZvciB0aGUgZmlyc3QgZWxlbWVudCBvciB0aGUgZGlyZWN0aXZlIG1hdGNoaW5nIHRoZSBzZWxlY3RvclxuICAgKiBpbiB0aGUgdmlldyBET00uIElmIHRoZSB2aWV3IERPTSBjaGFuZ2VzLCBhbmQgYSBuZXcgY2hpbGQgbWF0Y2hlcyB0aGUgc2VsZWN0b3IsXG4gICAqIHRoZSBwcm9wZXJ0eSBpcyB1cGRhdGVkLlxuICAgKlxuICAgKiBWaWV3IHF1ZXJpZXMgYXJlIHNldCBiZWZvcmUgdGhlIGBuZ0FmdGVyVmlld0luaXRgIGNhbGxiYWNrIGlzIGNhbGxlZC5cbiAgICpcbiAgICogKipNZXRhZGF0YSBQcm9wZXJ0aWVzKio6XG4gICAqXG4gICAqICogKipzZWxlY3RvcioqIC0gdGhlIGRpcmVjdGl2ZSB0eXBlIG9yIHRoZSBuYW1lIHVzZWQgZm9yIHF1ZXJ5aW5nLlxuICAgKiAqICoqcmVhZCoqIC0gcmVhZCBhIGRpZmZlcmVudCB0b2tlbiBmcm9tIHRoZSBxdWVyaWVkIGVsZW1lbnRzLlxuICAgKlxuICAgKiBTdXBwb3J0ZWQgc2VsZWN0b3JzIGluY2x1ZGU6XG4gICAqICAgKiBhbnkgY2xhc3Mgd2l0aCB0aGUgYEBDb21wb25lbnRgIG9yIGBARGlyZWN0aXZlYCBkZWNvcmF0b3JcbiAgICogICAqIGEgdGVtcGxhdGUgcmVmZXJlbmNlIHZhcmlhYmxlIGFzIGEgc3RyaW5nIChlLmcuIHF1ZXJ5IGA8bXktY29tcG9uZW50ICNjbXA+PC9teS1jb21wb25lbnQ+YFxuICAgKiB3aXRoIGBAVmlld0NoaWxkKCdjbXAnKWApXG4gICAqICAgKiBhbnkgcHJvdmlkZXIgZGVmaW5lZCBpbiB0aGUgY2hpbGQgY29tcG9uZW50IHRyZWUgb2YgdGhlIGN1cnJlbnQgY29tcG9uZW50IChlLmcuXG4gICAqIGBAVmlld0NoaWxkKFNvbWVTZXJ2aWNlKSBzb21lU2VydmljZTogU29tZVNlcnZpY2VgKVxuICAgKiAgICogYW55IHByb3ZpZGVyIGRlZmluZWQgdGhyb3VnaCBhIHN0cmluZyB0b2tlbiAoZS5nLiBgQFZpZXdDaGlsZCgnc29tZVRva2VuJykgc29tZVRva2VuVmFsOlxuICAgKiBhbnlgKVxuICAgKiAgICogYSBgVGVtcGxhdGVSZWZgIChlLmcuIHF1ZXJ5IGA8bmctdGVtcGxhdGU+PC9uZy10ZW1wbGF0ZT5gIHdpdGggYEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYpXG4gICAqIHRlbXBsYXRlO2ApXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqIHtAZXhhbXBsZSBjb3JlL2RpL3RzL3ZpZXdDaGlsZC92aWV3X2NoaWxkX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKlxuICAgKiB7QGV4YW1wbGUgY29yZS9kaS90cy92aWV3Q2hpbGQvdmlld19jaGlsZF9ob3d0by50cyByZWdpb249J0hvd1RvJ31cbiAgICpcbiAgICogIyMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIGNvcmUvZGkvdHMvdmlld0NoaWxkL3ZpZXdfY2hpbGRfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gICAqXG4gICAqIEBBbm5vdGF0aW9uXG4gICAqL1xuICAoc2VsZWN0b3I6IFR5cGU8YW55PnxGdW5jdGlvbnxzdHJpbmcsIG9wdHM/OiB7cmVhZD86IGFueX0pOiBhbnk7XG4gIG5ldyAoc2VsZWN0b3I6IFR5cGU8YW55PnxGdW5jdGlvbnxzdHJpbmcsIG9wdHM/OiB7cmVhZD86IGFueX0pOiBWaWV3Q2hpbGQ7XG59XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgVmlld0NoaWxkIG1ldGFkYXRhLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgVmlld0NoaWxkID0gUXVlcnk7XG5cbi8qKlxuICogVmlld0NoaWxkIGRlY29yYXRvciBhbmQgbWV0YWRhdGEuXG4gKlxuICogQEFubm90YXRpb25cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IFZpZXdDaGlsZDogVmlld0NoaWxkRGVjb3JhdG9yID0gbWFrZVByb3BEZWNvcmF0b3IoXG4gICAgJ1ZpZXdDaGlsZCcsIChzZWxlY3RvcjogYW55LCBkYXRhOiBhbnkpID0+XG4gICAgICAgICAgICAgICAgICAgICAoe3NlbGVjdG9yLCBmaXJzdDogdHJ1ZSwgaXNWaWV3UXVlcnk6IHRydWUsIGRlc2NlbmRhbnRzOiB0cnVlLCAuLi5kYXRhfSksXG4gICAgUXVlcnkpO1xuIl19