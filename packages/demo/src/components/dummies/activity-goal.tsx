import { InteractiveContentProps } from '@arsbreeze/interactive'
import { Button } from '@/components/ui/button'

export const ActivityGoal = ({
  onComplete,
  user
}: InteractiveContentProps & { user: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md p-4">
      <p className="text-sm text-muted-foreground">
        Set your daily activity goal.
      </p>
      <div className="flex items-center justify-between w-full">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => {}}
        >
          <span className="sr-only">Decrease</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M5 12h14" />
          </svg>
        </Button>
        <div className="flex-1 text-center">
          <div className="text-5xl font-bold tracking-tighter">350</div>
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            Calories/day
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-full"
          onClick={() => {}}
        >
          <span className="sr-only">Increase</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </Button>
      </div>
      <Button className="w-full" onClick={onComplete}>
        Set Goal
      </Button>
    </div>
  )
}
