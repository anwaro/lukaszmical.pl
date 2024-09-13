import {BorderFillResolver} from './resolver-border-fill';
import {ExcludeAlreadyDoneResolver} from './resolver-exclude-already-done';
import {IncludedPlusUnknownEqualToSumResolver} from './resolver-included-plus-unknown-equal-to-sum';
import {ValueGreaterThanHalfSizeResolver} from './resolver-value-greater-than-half-size';
import {ExcludeHoleSmallerThanValuesResolver} from './resolver-exclude-hole-smaller-than-values';
import {FillHoleForSingleValueResolver} from './resolver-fill-hole-for-single-value';
import {ExcludeForSingleResolver} from './resolver-exclude-for-single';
import {ExcludeForDoubleResolver} from './resolver-exclude-for-double';
import {SeparatedGroupsForDoubleValuesResolver} from './resolver-separated-groups-for-double-values';
import {AlreadyDoneGroupResolver} from './resolver-already-done-group';
import {SeparatedGroupsEqualToValuesResolver} from './resolver-separated-groups-equal-to-values';
import {SeparatedGroupNearBorderResolver} from './resolver-separated-group-near-border';
import {BiggestValueCheckedResolver} from './resolver-biggest-value-checked';
import {BorderExcludedResolver} from './resolver-border-exclude';
import {BorderFillSecondGroupResolver} from './resolver-border-fill-second-group';
import {ExtendsGroupNearExcludedResolver} from './resolver-extends-group-near-excluded';
import {FillHoleForDoubleValueResolver} from './resolver-fill-hole-for-double-value';
import {SplitGroupByBiggestValueResolver} from './resolver-split-group-by-biggest-value';

export const allResolvers = [
    BorderFillResolver,
    ExcludeAlreadyDoneResolver,
    IncludedPlusUnknownEqualToSumResolver,
    ValueGreaterThanHalfSizeResolver,
    ExcludeHoleSmallerThanValuesResolver,
    FillHoleForSingleValueResolver,
    ExcludeForSingleResolver,
    ExcludeForDoubleResolver,
    SeparatedGroupsForDoubleValuesResolver,
    AlreadyDoneGroupResolver,
    SeparatedGroupsEqualToValuesResolver,
    SeparatedGroupNearBorderResolver,
    BiggestValueCheckedResolver,
    BorderExcludedResolver,
    BorderFillSecondGroupResolver,
    ExtendsGroupNearExcludedResolver,
    FillHoleForDoubleValueResolver,
    SplitGroupByBiggestValueResolver,
];

export const splitGroupResolvers = [
    ExcludeHoleSmallerThanValuesResolver,
    SeparatedGroupsForDoubleValuesResolver,
    ValueGreaterThanHalfSizeResolver,
    AlreadyDoneGroupResolver,
    IncludedPlusUnknownEqualToSumResolver,
    ExcludeAlreadyDoneResolver,
    ExtendsGroupNearExcludedResolver,
    FillHoleForDoubleValueResolver,
    ExcludeForDoubleResolver,
];
