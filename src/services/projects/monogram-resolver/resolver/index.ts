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
import {IncludedGroupsEqualToValuesCountsResolver} from './resolver-included-groups-equal-to-values-counts';
import {ValueCanFillOnlyInOneHoleResolver} from './resolver-value-can-fill-only-in-one-hole';
import {OnlyFirstValueCanFitInFirstGroupResolver} from './resolver-only-first-value-can-fit-in-first-group';
import {IncludedGroupsWithSingleUnknownSeparatorResolver} from './resolver-included-groups-with-single-unknown-separator';
import {ExcludeHoleBeforeBiggestValueResolver} from './resolver-exclude-hole-before-biggest-value';
import {SeparatedGroupMustIncludeSpecificValueResolver} from './resolver-separated-group-must-include-specific-value';
import {ExcludeHoleForNonResolvedValuesResolver} from './resolver-exclude-hole-for-non-resolved-values';

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
    IncludedGroupsEqualToValuesCountsResolver,
    ValueCanFillOnlyInOneHoleResolver,
    OnlyFirstValueCanFitInFirstGroupResolver,
    IncludedGroupsWithSingleUnknownSeparatorResolver,
    ExcludeHoleBeforeBiggestValueResolver,
    SeparatedGroupMustIncludeSpecificValueResolver,
    ExcludeHoleForNonResolvedValuesResolver,
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
    ValueCanFillOnlyInOneHoleResolver,
    IncludedGroupsEqualToValuesCountsResolver,
    SeparatedGroupsEqualToValuesResolver,
];
