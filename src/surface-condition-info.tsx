import { Card, CardContent } from '@/components/ui/card';
import BackBtn from './components/back-btn';

const surfaceConditions = [
    {
        id: 'indoor-velodrome',
        name: 'Track (Indoor Wood)',
        description: 'Smooth, consistent wooden surface typically found in indoor velodromes'
    },
    {
        id: 'concrete-velodrome',
        name: 'Track (Outdoor Concrete)',
        description: 'Smooth concrete surface commonly used in outdoor velodromes'
    },
    {
        id: 'new-pavement',
        name: 'New Pavement',
        description: 'Fresh, smooth asphalt with minimal wear or imperfections'
    },
    {
        id: 'worn-pavement',
        name: 'Worn Pavement / Some Cracks',
        description: 'Asphalt showing signs of wear with occasional cracks and minor imperfections'
    },
    {
        id: 'cat1-gravel',
        name: 'Category 1 Gravel',
        description: 'Well-maintained gravel roads with fine, compact surface material'
    },
    {
        id: 'poor-pavement',
        name: 'Poor Pavement / Chipseal',
        description: 'Rough asphalt surface or chipseal with noticeable texture'
    },
    {
        id: 'cat2-gravel',
        name: 'Category 2 Gravel',
        description: 'Medium-grade gravel with occasional loose sections'
    },
    {
        id: 'cobblestone',
        name: 'Cobblestone',
        description: 'Traditional cobbled surface with regular gaps and variations'
    },
    {
        id: 'cat3-gravel',
        name: 'Category 3 Gravel',
        description: 'Rough gravel with larger stones and frequent loose sections'
    },
    {
        id: 'cat4-gravel',
        name: 'Category 4 Gravel',
        description: 'Very rough terrain with large loose stones and challenging surfaces',
        images: ['cat4-gravel-1', 'cat4-gravel-2', 'cat4-gravel-3']
    }
];

const SurfaceConditionInfo = () => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackBtn />
                    <h1 className="text-3xl font-bold">Surface Conditions</h1>
                </div>
            </div>

            <Card className="bg-transparent shadow-none border-0 md:bg-white/50 md:shadow-xl md:border">
                <CardContent className="p-0 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {surfaceConditions.map((condition) => (
                            <div key={condition.id} className="space-y-2">
                                {condition.images ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        {condition.images.map((imageId) => (
                                            <img
                                                key={imageId}
                                                src={`/assets/surface-condition/${imageId}.jpg`}
                                                alt={`${condition.name}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <img
                                        src={`/assets/surface-condition/${condition.id}.jpg`}
                                        alt={condition.name}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                )}
                                <h3 className="font-semibold text-lg">{condition.name}</h3>
                                <p className="text-sm text-gray-600">{condition.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SurfaceConditionInfo;
