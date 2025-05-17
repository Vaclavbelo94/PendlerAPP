
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Načítání funkcí...</p>
      </div>
    </div>
  );
};
