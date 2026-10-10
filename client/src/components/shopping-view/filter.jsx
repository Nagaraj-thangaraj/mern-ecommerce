


import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter, hideHeader = false }) {
  return (
    <div className="w-full rounded-lg bg-background md:shadow-sm">
      {!hideHeader && (
        <div className="border-b p-4">
          <h2 className="text-lg font-extrabold">Filters</h2>
        </div>
      )}
      <div className="space-y-4 p-2 md:p-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold capitalize">{keyItem}</h3>
              <div className="mt-2 grid gap-1">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md py-2 font-medium"
                  >
                    <Checkbox
                      checked={
                        !!(
                          filters &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        )
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
