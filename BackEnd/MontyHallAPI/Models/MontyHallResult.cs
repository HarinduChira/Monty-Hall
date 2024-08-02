namespace MontyHallAPI.Models
{
    public class MontyHallResult
    {
        public int SelectedDoor { get; set; }
        public int OpenedDoor { get; set; }
        public int PrizeDoor { get; set; }
        public string Choice { get; set; }
        public string Status { get; set; }
    }
}
