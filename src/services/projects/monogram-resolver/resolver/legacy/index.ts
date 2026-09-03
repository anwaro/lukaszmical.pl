import {IncludedGroupsIsSeparatedResolver} from './separated/resolver-included-groups-is-separated';
import {BorderFillResolver} from './first-and-biggest/resolver-border-fill';
import {ExcludeAlreadyDoneResolver} from './done/resolver-exclude-already-done';
import {IncludedPlusUnknownEqualToSumResolver} from './done/resolver-included-plus-unknown-equal-to-sum';
import {ValueOverlapResolver} from './basic/resolver-value-overlap';
import {ExcludeHoleSmallerThanValuesResolver} from './hole/resolver-exclude-hole-smaller-than-values';
import {FillHoleForSingleValueResolver} from './hole/resolver-fill-hole-for-single-value';
import {ExcludeForSingleResolver} from './first-and-biggest/resolver-exclude-for-single';
import {ExcludeForDoubleResolver} from './double/resolver-exclude-for-double';
import {SeparatedGroupsForDoubleValuesResolver} from './double/resolver-separated-groups-for-double-values';
import {IncludeAlreadyDoneGroupResolver} from './done/resolver-include-already-done-group';
import {SeparatedGroupsEqualToValuesResolver} from './separated/resolver-separated-groups-equal-to-values';
import {SeparatedGroupNearBorderResolver} from './separated/resolver-separated-group-near-border';
import {BiggestValueResolvedResolver} from './first-and-biggest/resolver-biggest-value-resolved';
import {BorderExcludedResolver} from './first-and-biggest/resolver-border-exclude';
import {BorderFillSecondGroupResolver} from './first-and-biggest/resolver-border-fill-second-group';
import {ExtendsGroupNearExcludedResolver} from './extend/resolver-extends-group-near-excluded';
import {FillHoleForDoubleValueResolver} from './hole/resolver-fill-hole-for-double-value';
import {SplitGroupByBiggestValueResolver} from './first-and-biggest/resolver-split-group-by-biggest-value';
import {IncludedGroupsEqualToValuesCountsResolver} from './separated/resolver-included-groups-equal-to-values-counts';
import {ValueCanFillOnlyInOneHoleResolver} from './first-and-biggest/resolver-value-can-fill-only-in-one-hole';
import {OnlyFirstValueCanFitInFirstSeparatedGroupResolver} from './first-and-biggest/resolver-only-first-value-can-fit-in-first-separated-group';
import {ExcludeSingleSeparatorResolver} from './separated/resolver-exclude-single-separator';
import {ExcludeHoleBeforeBiggestValueResolver} from './first-and-biggest/resolver-exclude-hole-before-biggest-value';
import {SeparatedGroupMustIncludesSpecificValueResolver} from './separated/resolver-separated-group-must-includes-specific-value';
import {ExcludeHoleForNonResolvedValuesResolver} from './hole/resolver-exclude-hole-for-non-resolved-values';
import {ExcludeHoleBeforeFirstValueResolver} from './first-and-biggest/resolver-exclude-hole-before-first-value';
import {FirstValueMustExistInFirstSeparatedGroupResolver} from './first-and-biggest/resolver-first-value-must-exist-in-first-separated-group';
import {ExtendsGroupsWithSeparatorBetweenResolver} from './extend/resolver-extends-groups-with-separator-between';
import {FirstValueMustBelongToFirstIncludedGroupResolver} from './first-and-biggest/resolver-first-value-must-belong-to-first-included-group';
import {AllCellsBeforeIncludedGroupAreResolvedResolver} from './done/resolver-all-cells-before-included-group-are-resolved';
import {FirstUnresolvedSeparatedGroupResolver} from './first-and-biggest/resolver-first-unresolved-separated-group';
import {BiggestUnresolvedValueResolver} from './first-and-biggest/resolver-biggest-unresolved-value';
import {CheckIsBiggestInSubGroupResolver} from './first-and-biggest/resolver-check-is-biggest-in-sub-group';

export const allResolvers = [
    BorderFillResolver,
    ExcludeAlreadyDoneResolver,
    IncludedPlusUnknownEqualToSumResolver,
    ValueOverlapResolver,
    ExcludeHoleSmallerThanValuesResolver,
    FillHoleForSingleValueResolver,
    ExcludeForSingleResolver,
    ExcludeForDoubleResolver,
    SeparatedGroupsForDoubleValuesResolver,
    IncludeAlreadyDoneGroupResolver,
    SeparatedGroupsEqualToValuesResolver,
    SeparatedGroupNearBorderResolver,
    BiggestValueResolvedResolver,
    BorderExcludedResolver,
    BorderFillSecondGroupResolver,
    ExtendsGroupNearExcludedResolver,
    FillHoleForDoubleValueResolver,
    SplitGroupByBiggestValueResolver,
    IncludedGroupsEqualToValuesCountsResolver,
    ValueCanFillOnlyInOneHoleResolver,
    OnlyFirstValueCanFitInFirstSeparatedGroupResolver,
    ExcludeSingleSeparatorResolver,
    ExcludeHoleBeforeBiggestValueResolver,
    SeparatedGroupMustIncludesSpecificValueResolver,
    ExcludeHoleForNonResolvedValuesResolver,
    ExcludeHoleBeforeFirstValueResolver,
    FirstValueMustExistInFirstSeparatedGroupResolver,
    ExtendsGroupsWithSeparatorBetweenResolver,
    FirstValueMustBelongToFirstIncludedGroupResolver,
    AllCellsBeforeIncludedGroupAreResolvedResolver,
    FirstUnresolvedSeparatedGroupResolver,
    BiggestUnresolvedValueResolver,
    CheckIsBiggestInSubGroupResolver,
    IncludedGroupsIsSeparatedResolver,
];

export const splitGroupResolvers = [
    ExcludeHoleSmallerThanValuesResolver,
    SeparatedGroupsForDoubleValuesResolver,
    ValueOverlapResolver,
    IncludeAlreadyDoneGroupResolver,
    IncludedPlusUnknownEqualToSumResolver,
    ExcludeAlreadyDoneResolver,
    ExtendsGroupNearExcludedResolver,
    FillHoleForDoubleValueResolver,
    ExcludeForDoubleResolver,
    ValueCanFillOnlyInOneHoleResolver,
    IncludedGroupsEqualToValuesCountsResolver,
    SeparatedGroupsEqualToValuesResolver,
];
