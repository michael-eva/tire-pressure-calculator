import { Button } from "./ui/button";

export default function BackBtn() {
    return (
        <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0"
        >
            ← Back
        </Button>
    )
}