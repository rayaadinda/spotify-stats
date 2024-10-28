import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

function CardSize() {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
			</CardHeader>
			<CardContent className="flex justify-center items-center">
				<img src="https://picsum.photos/200/300" alt="random" />
			</CardContent>
			<CardFooter className="flex justify-center items-center">
				<p>Card Footer</p>
			</CardFooter>
		</Card>
	)
}

export default CardSize
