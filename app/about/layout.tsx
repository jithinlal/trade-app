export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full h-full'>
			<div className='inline-block text-center justify-center h-full w-full'>
				{children}
			</div>
		</section>
	);
}
