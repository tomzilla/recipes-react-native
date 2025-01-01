import { Mermaid } from "./Mermaid";

export function Graph() {
    return (
        <div className="graph">
            <Mermaid text={`flowchart LR
                s[Starter 50-100g: bubbly, active]
                w[Water 375g: warm]
                f[Flour 500g: bread flour]
                sa[Salt 9-12g]
                
                m1(Wet mixture: homogeneous, no lumps)
                d1(Rough dough: all flour incorporated)
                d2(Rested dough: slightly relaxed)
                d3(Worked dough: elastic, stronger)
                d4(Fermented dough: 50% volume increase, jiggly)
                d5(Shaped round: taut surface)
                d6(Rested round: relaxed)
                d7(Final shape: tight, smooth surface)
                d8(Proofed dough: puffy, springs back slowly)
                d9(Scored dough: clean cuts, 1/4in deep)
                b1(Partially baked bread: golden crust forming)
                b2(Final bread: golden-brown, hollow sound)

                s & w -->|whisk until combined| m1
                m1 & f & sa -->|mix until no dry flour| d1
                d1 -->|rest with damp towel, 30min, room temp| d2
                d2 -->|4-5 stretch and folds, 2hrs total| d3
                d3 -->|ferment 8-10hrs, 70°F| d4
                d4 -->|shape into round| d5
                d5 -->|rest seam up, 30min| d6
                d6 -->|shape again| d7
                d7 -->|proof in fridge, 24-48hrs| d8
                d8 -->|score with knife| d9
                d9 -->|bake covered, 450°F, 30min| b1
                b1 -->|bake uncovered, 400°F, 10-15min| b2`} />

        </div>
    );
}