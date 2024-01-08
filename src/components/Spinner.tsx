const Spinner = () => {
  return (
    <div className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full dark:text-white" role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;