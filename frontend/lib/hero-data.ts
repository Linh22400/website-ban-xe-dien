import { getHeroSlides, getPromotions, HeroSlide, Promotion } from "./api";

export type HeroSlideWithType = HeroSlide & { slideType: 'hero' };
export type PromotionWithType = Promotion & { slideType: 'promotion' };
export type SlideType = HeroSlideWithType | PromotionWithType;

export async function getMergedHeroSlides(): Promise<SlideType[]> {
    try {
        // Fetch in parallel
        const [heroData, promoData] = await Promise.all([getHeroSlides(), getPromotions()]);

        // Prioritize TAILG promotions
        const sortedPromos = promoData.sort((a, b) => {
            const aTailg = a.title?.toLowerCase().includes('tailg') ? 1 : 0;
            const bTailg = b.title?.toLowerCase().includes('tailg') ? 1 : 0;
            return bTailg - aTailg;
        }).slice(0, 2); // Max 2 promotion slides

        // Prepare typed arrays
        const heroSlides: SlideType[] = heroData.map(s => ({ ...s, slideType: 'hero' as const }));
        const promoSlides: SlideType[] = sortedPromos.map(s => ({ ...s, slideType: 'promotion' as const }));

        const mergedSlides: SlideType[] = [];

        if (heroSlides.length > 0 && promoSlides.length > 0) {
            // Interleave: hero, hero, promo, hero, promo pattern
            const totalSlides = heroSlides.length + promoSlides.length;
            let heroIndex = 0;
            let promoIndex = 0;

            for (let i = 0; i < totalSlides; i++) {
                // Every 3rd slide is a promo (index 2, 5, 8...)
                if (i % 3 === 2 && promoIndex < promoSlides.length) {
                    mergedSlides.push(promoSlides[promoIndex++]);
                } else if (heroIndex < heroSlides.length) {
                    mergedSlides.push(heroSlides[heroIndex++]);
                } else if (promoIndex < promoSlides.length) {
                    // If out of heroes, append remaining promos
                    mergedSlides.push(promoSlides[promoIndex++]);
                }
            }
            return mergedSlides;
        } else {
            return [...heroSlides, ...promoSlides];
        }
    } catch (error) {
        console.error("Error merging hero slides:", error);
        return [];
    }
}
