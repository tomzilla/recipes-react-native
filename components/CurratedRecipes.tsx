import { Button, Card } from '@rneui/themed';
import { Gift, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function CurratedRecipes() {
    const [curatedRecipes] = useState([
        { id: 1, name: "Classic Chocolate Chip Cookies", description: "America's favorite cookie recipe simplified" },
        { id: 2, name: "Basic Pizza Dough", description: "Perfect pizza base every time" },
        { id: 3, name: "Chicken Noodle Soup", description: "Comforting homemade soup made easy" },
        { id: 4, name: "Banana Bread", description: "Classic recipe with simple steps" }
      ]);
    
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-1 mb-3">
            <Gift size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold">Free Curated Recipes</h2>
            </div>
            
            <div className="space-y-2">
            {curatedRecipes.map(recipe => (
                <Card key={recipe.id}>
                    <div className="space-y-2">
                    <div>
                        <p className="text-sm font-medium">{recipe.name}</p>
                        <p className="text-xs text-gray-500">{recipe.description}</p>
                    </div>
                    <Button 
                        size="sm"
                        className="w-full"
                    >
                        View Flowchart
                        <ArrowRight size={14} className="ml-1" />
                    </Button>
                    </div>
                </Card>
            ))}
            </div>
        </div>
    );
}