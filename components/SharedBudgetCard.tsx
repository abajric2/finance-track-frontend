"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Share2 } from "lucide-react";

type Person = {
  name: string;
  avatar: string;
};

type Props = {
  category: string;
  spent: number;
  budget: number;
  isShared: boolean;
  sharedWith?: Person[];
  period?: string;
  onShare?: () => void;
  readonly?: boolean;
};

export const SharedBudgetCard = ({
  category,
  spent,
  budget,
  isShared,
  sharedWith = [],
  period = "",
  onShare,
  readonly = false,
}: Props) => {
  const overBudget = spent > budget;
  const percentage = Math.min((spent / budget) * 100, 100);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{category}</span>
              {isShared && (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  Shared
                </Badge>
              )}
            </div>
            {period && <p className="text-xs py-1">{period}</p>}
            <div className="text-xs text-muted-foreground">
              ${spent.toFixed(2)} of ${budget.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isShared && sharedWith.length > 0 && (
              <div className="flex -space-x-2 mr-2">
                {sharedWith.slice(0, 3).map((person, index) => (
                  <Avatar
                    key={index}
                    className="border-2 border-background h-6 w-6"
                  >
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {sharedWith.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{sharedWith.length - 3}
                  </div>
                )}
              </div>
            )}
            {!readonly && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            )}
            <div
              className={`text-sm font-medium ${
                overBudget ? "text-destructive" : ""
              }`}
            >
              {overBudget ? "Over budget" : `${100 - percentage}% left`}
            </div>
          </div>
        </div>
        <Progress
          value={percentage}
          className={overBudget ? "bg-destructive/20" : ""}
        />
      </CardContent>
    </Card>
  );
};
